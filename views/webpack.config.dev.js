const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.common');

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackBar = require('webpackbar');
// const ImageminPlugin = require('imagemin-webpack-plugin').default;
// const WriteFilePlugin = require('write-file-webpack-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MediaQueryPlugin = require('media-query-plugin');
// const Dotenv = require('dotenv-webpack');

const productionMode = process.env.NODE_ENV === 'production';
const DEV_SERVER_PORT = 2711;
const publicPath = `http://localhost:${DEV_SERVER_PORT}/`;

const devConfig = merge(commonConfig, {
  mode: 'development',
  output: {
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules|bower_components|prototype)/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules|bower_components|prototype)/,
        // include: [
        //     path.resolve(__dirname, './entrypoints/signin'),
        //     path.resolve(__dirname, './entrypoints/signup')
        //     // path.resolve(__dirname, 'entrypoints/**')
        // ],
        options: {
          envName: process.env.BABEL_ENV || process.env.NODE_ENV || 'development',
          configFile: './.babelrc', // must be specified as babel-loader doesnot find it
        },
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            options: {
              sourceMap: true,
            },
            loader: 'css-loader',
          },
          MediaQueryPlugin.loader,
          {
            options: {
              sourceMap: true,
            },
            loader: 'resolve-url-loader',
            // }, {
            //     options: {
            //         ident: 'postcss',
            //         plugins: (loader) => [
            //             require('postcss-import')({ root: loader.resourcePath }),
            //             require('postcss-preset-env')()
            //         ],
            //         // sourceMap: 'inline'
            //     },
            //     loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              // sassOptions: {
              //   includePaths: ['absolute/path/a', 'absolute/path/b'],
              // },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            options: {
              sourceMap: true,
            },
            loader: 'css-loader',
          },
          MediaQueryPlugin.loader,
          {
            options: {
              sourceMap: true,
            },
            loader: 'resolve-url-loader',
          },
        ],
      },
      {
        test: /\.pug$/,
        exclude: path.resolve(__dirname, './node_modules/'),
        options: {
          self: false,
        },
        loader: 'pug-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            options: {
              name: '[name].[ext]',
              limit: 8192,
            },
            loader: 'url-loader',
          },
          {
            options: {
              name: '[name].[ext]',
              disable: true, // webpack@2.x and newer
            },
            loader: 'image-webpack-loader',
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        loader: 'url-loader',
      },
    ],
  },
  watchOptions: {
    ignored: ['ssr/**/*', 'node_modules'],
    poll: 1000, // Check for changes every second
  },
  devtool: 'inline-source-map', // use 'source-map' for production
  devServer: {
    index: '', // specify to enable root proxying
    proxy: {
      '/backdoor/default-api-endpoint': {
        target: 'http://localhost:2004', // node dev server
        secure: false,
        changeOrigin: true,
      },
      '/index.html': {
        target: 'http://localhost:2711',
        secure: false,
        changeOrigin: true,
        bypass: (req, res, proxyOptions) => {
          if (req.method === 'POST') return;
          return '/';
        },
      },
      // '/backdoor': {
      //   target: 'http://localhost:3000',
      //   secure: false,
      //   changeOrigin: true,
      // },
      '/signin': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        bypass: (req, res, proxyOptions) => {
          if (req.method === 'POST') return;
          return '/signin/index.html';
        },
      },
      '/signup': {
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        bypass: (req, res, proxyOptions) => {
          if (req.method === 'POST') return;
          return '/signup/index.html';
        },
      },
      '/': {
        target: 'http://localhost:3000', // node dev server
        secure: false,
        changeOrigin: true,
      },
    },
    // publicPath,
    public: 'http://localhost:' + DEV_SERVER_PORT,
    historyApiFallback: {
      index: '/',
      rewrites: [{ from: /\/signout/, to: '/signout' }],
    },
    noInfo: true,
    stats: 'minimal', // This option has no effect when used with quiet or noInfo.
    open: true,
    // openPage: '',
    useLocalIp: true,
    host: '0.0.0.0', // use current IP to allow access via LAN
    hot: true, // disable while developing static landing pages on HTML files
    compress: false,
    port: DEV_SERVER_PORT,
    // https: true,// true for self-signed, object for cert authority
    contentBase: path.resolve(__dirname, '../public'),
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  plugins: [
    new WebpackBar(),
    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: ['../public/*.*'],
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    // new WriteFilePlugin({
    //   // receive imported files from index.js
    //   test: /\.(jpe?g|png|gif|svg|mp4)$/i, // Write only files that have these extension.
    //   // force: true,
    //   useHashIndex: false,
    // }),
    new CopyWebpackPlugin([
      { from: './assets/manifest.webmanifest', to: '../public/manifest.webmanifest' },
      { from: './assets/fav/favicon.ico', to: '../public/favicon.ico' },
    ]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.pug',
      inject: false,
      chunks: [], // added manually in pug templates
      // favicon: '../public/favicon.ico',
      // minify: true,
      // hash: true,
      title: 'Address Book',
      isSignedIn: true,
      prod: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'signin.html',
      template: './signin.pug',
      chunks: [], // added manually in pug templates
      // favicon: '../public/favicon.ico',
      // minify: true,
      // hash: true,
      title: 'Sign In',
      prod: false,
      ssr: require('./ssr/Signin.ssr') ? require('./ssr/Signin.ssr').default : '',
    }),
    new HtmlWebpackPlugin({
      filename: 'signup.html',
      template: './signup.pug',
      chunks: [], // added manually in pug templates
      // favicon: '../public/favicon.ico',
      // minify: true,
      // hash: true,
      title: 'Sign Up',
      prod: false,
      ssr: require('./ssr/Signup.ssr') ? require('./ssr/Signup.ssr').default : '',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      // jQuery: 'jquery',
      // $: 'jquery',
      adbk: ['adbk', 'default'],
      core: ['core', 'default'],
    }),
    // new webpack.DefinePlugin({}),
    new webpack.EnvironmentPlugin({
      // shorthand for webpack.DefinePlugin with 'process.env.<key>'
      NODE_ENV: process.env.NODE_ENV || 'development',
      PORT: DEV_SERVER_PORT,
      FE_ENV: process.env.FE_ENV || 'development',
      // BE_ENV: process.env.BE_ENV || 'development',//should be unset while developing front-end using webpack dev server
      HOT_RELOAD: process.env.HOT_RELOAD === 'true',
      DEBUG: process.env.DEBUG === 'true',
    }),
    // new Dotenv({
    //   path: './.env', // Path to .env file (default)
    //   safe: true, // load .env.example (defaults to "false" which does not use dotenv-safe)
    // }),
  ],
});

module.exports = devConfig;
