const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve('dist', 'assets'),
    publicPath: '/assets/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'less-loader' }
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' }
          ]
        })
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin('main.css')
  ]
};
