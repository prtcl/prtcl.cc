const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const AUTHOR = "Cory O'Brien";
const DESCRIPTION = `${AUTHOR} is a software engineer and sound artist who lives in NYC`;
const CANONICAL = 'http://prtcl.cc';

module.exports = {
  entry: './src/main.tsx',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'less-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HtmlWebpackPlugin({
      title: AUTHOR,
      template: path.resolve('templates', 'index.html'),
      meta: {
        author: AUTHOR,
        description: DESCRIPTION,
        themeColor: { name: 'theme-color', content: '#fafafa' },
        viewport: 'width=device-width, initial-scale=1, user-scalable=no',
        'google-site-verification':
          'Ydq_4fjxlJ7tZVQZzS4DXQ1VDqWU7lCIT_fiw_HUJlQ',
        'og:title': { property: 'og:title', content: AUTHOR },
        'og:url': { property: 'og:url', content: CANONICAL },
        'og:description': { property: 'og:description', content: DESCRIPTION },
      },
    }),
  ],
};
