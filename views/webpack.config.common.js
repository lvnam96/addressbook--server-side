const path = require('path');
const webpack = require('webpack');

const publicPath = '/';

module.exports = {
  entry: {
    core: './core/js/index.js',
    App: './entrypoints/main/src/index.js',
    Signin: './entrypoints/signin/index.js',
    Signup: './entrypoints/signup/index.js',
  },
  output: {
    publicPath, // must be set to solve this issue with import() on nested routes: https://github.com/webpack/webpack/issues/7417
    path: path.resolve(__dirname, '../public'),
    filename: '[name].js', // use entry property names, e.g: Signin.js
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      adbk: path.resolve(__dirname, './entrypoints/main/src/js/controllers/adbk'),
      core: path.resolve(__dirname, './core/js/controllers/index'),
      'lodash-es': 'lodash', // https://github.com/GoogleChromeLabs/webpack-libs-optimizations#alias-lodash-es-to-lodash
    },
  },
  devtool: 'source-map', // use 'source-map' for production
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //   }, // https://webpack.js.org/plugins/split-chunks-plugin/
  // },
  module: {},
};
