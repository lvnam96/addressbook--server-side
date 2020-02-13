const path = require('path');
// const webpack = require('webpack');

const publicPath = '/';

module.exports = {
  entry: {
    core: path.resolve(__dirname, './core/js/index.js'),
    App: path.resolve(__dirname, './entrypoints/main/src/index.js'),
    Signin: path.resolve(__dirname, './entrypoints/signin/index.js'),
    Signup: path.resolve(__dirname, './entrypoints/signup/index.js'),
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
  //   runtimeChunk: 'single', // https://webpack.js.org/guides/caching/
  //   splitChunks: {
  //     chunks: 'all',
  //   }, // https://webpack.js.org/plugins/split-chunks-plugin/
  // },
  module: {},
};
