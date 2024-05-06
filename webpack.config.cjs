const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const author = "Cory O'Brien";
const description = `${author} is a software engineer and sound artist who lives in NYC`;
const canonical = 'http://prtcl.cc';

const html = new HtmlWebpackPlugin({
  title: author,
  template: path.resolve('templates', 'index.html'),
  meta: {
    author,
    description,
    themeColor: { name: 'theme-color', content: '#fff' },
    viewport: 'width=device-width, initial-scale=1, user-scalable=no',
    'google-site-verification': 'Ydq_4fjxlJ7tZVQZzS4DXQ1VDqWU7lCIT_fiw_HUJlQ',
    'og:title': { property: 'og:title', content: author },
    'og:url': { property: 'og:url', content: canonical },
    'og:description': { property: 'og:description', content: description },
  },
});

const extractCss = new MiniCssExtractPlugin({
  filename: '[name].[contenthash].css',
});

module.exports = {
  devtool: 'source-map',
  entry: './src/main.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
      'styled-system': path.resolve(__dirname, 'styled-system'),
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
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [html, extractCss],
};
