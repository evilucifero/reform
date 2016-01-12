'use strict'

var webpack = require('webpack');
var path = require('path');

module.exports = {
  devServer: {
    hot: true,
    inline: true,
    progress: true,
    contentBase: './demo',
    port: 3223
  },
  devtool: 'source-map',
  entry: {
    'admin/app': path.resolve(__dirname, 'src/js/admin/app.js'),
    'form/app': path.resolve(__dirname, 'src/js/form/app.js'),
    'create/app': path.resolve(__dirname, 'src/js/create/app.js'),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets:['es2015','react']
        }
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'style!css!sass',
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    })
  ]
};
