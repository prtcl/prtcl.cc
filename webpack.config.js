
const path = require('path');

module.exports = {
  entry: './app/app.js',
  output: {
    path: path.resolve('www', 'assets'),
    publicPath: '/assets/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loaders: 'buble-loader',
        include: path.resolve('app')
      }
    ]
  }
};
