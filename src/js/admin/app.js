import React from 'react';
import ReactDOM from 'react-dom';
import M from 'moment';
import I from './components/inp'

const Admin = React.createClass({
  getInitialState() {
    return {
      title: '',
      description: '',
      questions: [],
      answers: []
    };
  },

  componentDidMount() {
    this.fetchForm();
    this.pullRequest();
  },

  pullRequest() {
    setTimeout(()=>{
      this.fetchForm();
      this.pullRequest();
    }, 3000);
  },

  fetchForm() {
    fetch(
      '/api/Forms/' + window.location.search.slice(4), { method: 'GET' }
    ).then((response) => response.json()).then((data) => {
      const { title, description, questions, id } = data;
      this.setState({
        title,
        description,
        questions,
        id
      });

      fetch(
        '/api/Answers?filter[where][formId]=' + id, { method: 'GET' }
      ).then((response) => response.json()).then((answers) => {
        this.setState({answers});
      });
    });
  },

  visitorStat() {
    const { id, answers } = this.state;
    if (!id || !answers) return "M0,190L1000,190";
    const startTime = parseInt((id || '').slice(0, 8), 16) * 1000;
    const endTime = (new Date).valueOf();
    const ratio = 100 / (endTime - startTime);
    const timestamps = answers.map((v) => (Math.ceil(ratio * (v.start - startTime)) - 1));
    // timestamps.push(Math.ceil(ratio * (endTime - startTime)) - 1);
    // timestamps.unshift(0);
    const points = [];
    for (var i = 0; i <= 99; i++) {
      points.push([i * 10 + 5, 0]);
    }
    for (var i = 0; i < timestamps.length; i++) {
      points[timestamps[i]][1]++;
    }
    const max = points.reduce((a, b)=>{
      if (b[1] > a) {
        return b[1];
      }
      else {
        return a;
      }
    }, 0);
    for (var i = 0; i < points.length; i++) {
      points[i][1] = 200 - 190 * points[i][1] / max;
    }
    return I.monotone(points);
  },

  render() {
    const { title, id, description, questions, answers } = this.state;

    this.visitorStat();

    return (
      <div style={{marginBottom: '60px'}}>
        <div className="jumbotron" style={{backgroundColor: '#666',color: '#fff'}}>
          <div className="container">
            <h1>{title}&nbsp;<span style={{fontSize: '20px', color: '#999'}}>{id}</span></h1>
            <h3 style={{color: '#ccc'}}>{description}</h3>
          </div>
        </div>
        <div className="container clearfix">
          <div className="clearfix">
            <h3>基本信息</h3>
            <hr/>
            <div className="col-md-4">
              <section className="panel">
                <div className="symbol btn-danger">
                  <span className="glyphicon glyphicon-user"></span>
                </div>
                <div className="value">
                  <h1>{answers.length}</h1>
                  <p>参与人数</p>
                </div>
              </section>
            </div>
            <div className="col-md-4">
              <section className="panel">
                <div className="symbol btn-warning">
                  <span className="glyphicon glyphicon-retweet"></span>
                </div>
                <div className="value">
                  <h1>
                    {
                      (
                        answers.reduce((a, b)=>(
                          a + b.answers.reduce((c, d)=>(
                            c + d.changedTime
                          ), 0)
                        ), 0) / answers.length / questions.length
                      ).toFixed(2)
                    }
                  </h1>
                  <p>犹豫指数</p>
                </div>
              </section>
            </div>
            <div className="col-md-4">
              <section className="panel">
                <div className="symbol btn-info">
                  <span className="glyphicon glyphicon-time"></span>
                </div>
                <div className="value">
                  <h1>
                    {
                      function() {
                        const d = M.duration(
                          answers.reduce((a, b)=>(
                            a + b.end - b.start
                          ), 0) / answers.length
                        );
                        return d.hours()
                          +':'+d.minutes()
                          +':'+d.seconds()
                          +'.'+Math.floor(d.milliseconds()/10)
                      }.call()
                    }
                  </h1>
                  <p>平均用时</p>
                </div>
              </section>
            </div>
          </div>
          <div className="clearfix">
            <h3>访问趋势</h3>
            <hr/>
            <div className="col-md-12">
              <div style={{
                  position: 'relative',
                  height: '220px'
                }}
              >
                <svg height="200" version="1.1" width="1000" xmlns="http://www.w3.org/2000/svg"
                  style={{
                    overflow: 'hidden',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    margin: '-100px 0 0 -500px'
                  }}
                >
                  <path fill="none" stroke="#5baead" d={this.visitorStat()} style={{strokeWidth: 2, strokeLinecap: 'round'}}></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="clearfix">
            <h3>详细结果</h3>
            <hr/>
            <div className="col-md-12">
              <table className="table table-responsive table-striped table-bordered">
                <thead>
                  <tr>
                    <th>序号</th>
                    {
                      questions.map((v, i) => (<th key={i}>{v.description}</th>))
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    answers.map((v, i) => (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        {
                          v.answers.map((w, j) => (<th key={j}>{w.answer}</th>))
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<Admin/>, document.getElementById('main'));
