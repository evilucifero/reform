import _ from 'lodash';

export default {
  getGroup: function (points) {
    var group = []
      , j = 0;

    for (var i = 0, len = points.length; i < len; i++) {
      if (!_.isNumber(points[i][0]) || !_.isNumber(points[i][1])) {
        group.push(points.slice(j, i));

        j = i + 1;
      }
    }

    if (j < len) {
      group.push(points.slice(j));
    }

    return group;
  },
  linear: function (points) {
    var group = this.getGroup(points)
      , path = '';

    for (var i = 0, len = group.length; i < len; i++) {
      path += this.linearSingle(group[i]);
    }

    return path;
  },
  linearSingle: function (points) {
    var path;

    for (var i = 0, len = points.length; i < len; i++) {
      if (i) {
        path += 'L' + points[i];
      } else {
        path = 'M' + points[i];
      }
    }
    return path;
  },
  stepMiddle: function (points) {
    var group = this.getGroup(points)
      , path = '';

    for (var i = 0, len = group.length; i < len; i++) {
      path += this.stepMiddleSingle(group[i]);
    }

    return path;
  },

  stepMiddleSingle: function (points) {
    var path;

    for (var i = 0, len = points.length; i < len; i++) {
      if (i) {
        path += 'H' + ((points[i - 1][0] + points[i][0]) / 2) + 'V' + points[i][1] + 'H' + points[i][0];
      } else {
        path = 'M' + points[i];
      }
    }
    return path;
  },

  stepBefore: function (points) {
    var group = this.getGroup(points)
      , path = '';

    for (var i = 0, len = group.length; i < len; i++) {
      path += this.stepBeforeSingle(group[i]);
    }

    return path;
  },

  stepBeforeSingle: function (points) {
    var path;

    for (var i = 0, len = points.length; i < len; i++) {
      if (i) {
        path += 'V' + points[i][1] + 'H' + points[i][0];
      } else {
        path = 'M' + points[i];
      }
    }
    return path;
  },

  stepAfter: function (points) {
    var group = this.getGroup(points)
      , path = '';

    for (var i = 0, len = group.length; i < len; i++) {
      path += this.stepAfterSingle(group[i]);
    }

    return path;
  },

  stepAfterSingle: function (points) {
    var path;

    for (var i = 0, len = points.length; i < len; i++) {
      if (i) {
        path += 'H' + points[i][0] + 'V' + points[i][1];
      } else {
        path = 'M' + points[i];
      }
    }
    return path;
  },

  caridinal : function (points, tension) {
    var group = this.getGroup(points)
      , path = '';

    for (var i = 0, len = group.length; i < len; i++) {
      path += this.caridinalSingle(group[i]);
    }

    return path;
  },
  caridinalSingle: function (points, tension) {
    tension = tension || 0.7;

    return points.length < 3
    ? this.linear(points)
    : this.hermite(points, this.cardinalTangents(points, tension));
  },
  monotone: function (points) {
    var group = this.getGroup(points)
      , path = '';

    for (var i = 0, len = group.length; i < len; i++) {
      path += this.monotoneSingle(group[i]);
    }

    return path;
  },
  monotoneSingle: function (points) {
    return points.length < 3
        ? this.linear(points)
        : this.hermite(points, this.monotoneTangents(points));
  },
  hermite: function (points, tangents) {
    if (tangents.length < 1 ||
        (points.length !== tangents.length &&
          points.length !== tangents.length + 2)) {
      return this.linear(points);
    }

    //if tangents.length >= 1 && (points.length == tangents.length || points.length == tangents.length + 2)  ,then go on
    var quad = points.length !== tangents.length
      , p0 = points[0]
      , p = points[1]
      , t0 = tangents[0]
      , t = t0
      , pi = 1
      , path = '';

    path += 'M' + p0;

    if (quad) {
      path += 'Q' + (p[0] - t0[0] * 2 / 3) + ',' +
              (p[1] - t0[1] * 2 / 3) + ',' + p[0] + ',' + p[1];

      p0 = points[1];
      pi = 2;
    }

    if (tangents.length > 1) {
      t = tangents[1];
      p = points[pi];
      pi++;
      path += 'C' + (p0[0] + t0[0]) + ',' + (p0[1] + t0[1])
            + ',' + (p[0] - t[0]) + ',' + (p[1] - t[1])
            + ',' + p[0] + ',' + p[1];

      for (var i = 2, len = tangents.length; i < len; i++, pi++) {
        p = points[pi];
        t = tangents[i];
        path += 'S' + (p[0] - t[0]) + ',' + (p[1] - t[1])
              + ',' + p[0] + ',' + p[1];
      }
    }

    if (quad) {
      var lp = points[pi];
      path += 'Q' + (p[0] + t[0] * 2 / 3) + ',' + (p[1] + t[1] * 2 / 3)
          + ',' + lp[0] + ',' + lp[1];
    }

    return path;
  },
  cardinalTangents: function (points, tension) {
    var tangents = []
      , a = (1 - tension) / 2
      , p0 = points[0]
      , p1 = points[1]
      , p2 = points[2];

    for (var i = 2, len = points.length; i < len; i++) {
      tangents.push([a * (p2[0] - p0[0]), a * (p2[1] - p0[1])]);
      p0 = p1;
      p1 = p2;
      p2 = points[i + 1];
    }

    return tangents;
  },
  //Computes the slope from points p0 to p1.
  slope: function (p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
  },
  // Compute three-point differences for the given points.
  // http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Finite_difference
  finiteDifferences: function (points) {
    var m = [], s0, s1;

    m[0] = s0 = this.slope(points[0], points[1]);

    for (var i = 1, len = points.length; i < len - 1; i++) {
      s1 = this.slope(points[i], points[i + 1]);
      m[i] = (s0 + s1) / 2;

      s0 = s1;
    }

    m[len - 1] = s0;

    return m;
  },

  // Interpolates the given points using Fritsch-Carlson Monotone cubic Hermite
  // interpolation. Returns an array of tangent vectors. For details, see
  // http://en.wikipedia.org/wiki/Monotone_cubic_interpolation
  monotoneTangents: function (points) {
    var tangents = [],
        m = this.finiteDifferences(points),
        eps = 1e-6;

    // The first two steps are done by computing finite-differences:
    // 1. Compute the slopes of the secant lines between successive points.
    // 2. Initialize the tangents at every point as the average of the secants.

    // Then, for each segment…
    var delta, alpha, beta, square;
    for (var i = 0, len = points.length; i < len -1; i++) {
      delta = this.slope(points[i], points[i + 1]);
      // 3. If two successive yk = y{k + 1} are equal (i.e., d is zero), then set
      // mk = m{k + 1} = 0 as the spline connecting these points must be flat to
      // preserve monotonicity. Ignore step 4 and 5 for those k.
      if (Math.abs(delta) < eps) {
        m[i] = m[i + 1] = 0;
      } else {
        // 4. Let ak = mk / dk and bk = m{k + 1} / dk.
        alpha = m[i] / delta;
        beta = m[i + 1] / delta;

        // when alpha < 0, the ith point is a local extremum point
        if (alpha < 0) {
          m[i] = 0;
          alpha = 0;
        }
        // when beta < 0 the (i+1)th point is a local extremum point
        if (beta < 0) {
          m[i + 1] = 0;
          beta = 0;
        }

        // 5. Prevent overshoot and ensure monotonicity by restricting the
        // magnitude of vector <ak, bk> to a circle of radius 3.
        square = alpha * alpha + beta * beta;

        if (square > 9) {
          square = delta * (3 / mathSqrt(square));
          m[i] = square * alpha;
          m[i + 1] = square * beta;
        }
      }
    }

    var temp;
    for (i = 0; i < len; i++) {
      if (i >= 1 && i <= len - 2) {
        temp = points[i + 1][0] - points[i - 1][0];
      } else if (i < 1) {
        temp = points[1][0] - points[0][0];
      } else {
        temp = points[len - 1][0] - points[len - 2][0];
      }

      temp /= (6 * (1 + m[i] * m[i]));

      tangents.push([temp || 0, m[i] * temp || 0]);
    }

    return tangents;
  }
};
