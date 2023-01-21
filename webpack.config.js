const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const AUTHOR = 'Cory O\'Brien';
const DESCRIPTION = 'Cory O\'Brien is a software engineer and sound artist who lives in NYC';
const CANONICAL = 'http://prtcl.cc';

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve('dist'),
    filename: '[name].[contenthash].js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src', 'assets'),
          to: path.resolve('dist', 'assets')
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      title: AUTHOR,
      template: path.resolve('src', 'html', 'index.html'),
      meta: {
        author: AUTHOR,
        description: DESCRIPTION,
        viewport: 'width=device-width, initial-scale=1, user-scalable=no',
        'google-site-verification': 'Ydq_4fjxlJ7tZVQZzS4DXQ1VDqWU7lCIT_fiw_HUJlQ',
        'og:title': { property: 'og:title', content: AUTHOR, },
        'og:url': { property: 'og:url', content: CANONICAL },
        'og:description': { property: 'og:description', content: DESCRIPTION },
      }
    }),
  ],
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
    ]
  },
};
