const merge = require('webpack-merge');
const commonConfig = require('./webpack.config.common');

const path = require('path');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const _isEmpty = require('lodash/isEmpty');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const analyzingMode = !_isEmpty(process.env.ANALYZE) ? JSON.parse(process.env.ANALYZE) : false;

const cssPlugins = [
  {
    options: {
      // publicPath: '../'// by default it use publicPath in webpackOptions.output
      sourceMap: true,
      esModule: true,
    },
    loader: MiniCssExtractPlugin.loader,
  },
  {
    options: {
      // modules: true, // should not be used, see: https://github.com/csstools/postcss-normalize#postcss-import-usage to use the alternative way
      sourceMap: true,
    },
    loader: 'css-loader',
  },
  {
    options: {
      sourceMap: true,
    },
    loader: 'resolve-url-loader',
  },
  {
    options: {
      ident: 'postcss',
      plugins: (loader) => [
        require('postcss-import')({ root: loader.resourcePath }),
        require('postcss-preset-env')(),
        require('postcss-flexbugs-fixes')(),
        // require('stylelint')(), // print warning to console
        require('postcss-normalize')(),
        // require('autoprefixer')(), // not necessary if use postcss-preset-env already
        // require('cssnano')(), // does not work with mini-css-extract-plugin
      ],
      sourceMap: true,
    },
    loader: 'postcss-loader',
  },
];
const prodConfig = merge(commonConfig, {
  mode: 'production',
  externals: {
    // don't include these packages/modules in node_modules but use CDN, still have to import in each file
    react: 'React',
    'react-dom': 'ReactDOM',
    '@sentry/browser': 'Sentry',
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules|bower_components|prototype)/,
        options: {
          envName: process.env.BABEL_ENV || process.env.NODE_ENV || 'production',
          configFile: './.babelrc', // must be specified as babel-loader doesnot find it
        },
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          ...cssPlugins,
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
        use: [...cssPlugins],
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
              limit: 8192,
            },
            loader: 'url-loader',
          },
          {
            options: {
              name: '[name].[ext]',
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
              },
            },
            loader: 'image-webpack-loader',
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        options: {
          limit: 8192,
        },
        loader: 'url-loader',
      },
    ],
  },
  plugins: [
    new LodashModuleReplacementPlugin({
      // https://github.com/lodash/lodash-webpack-plugin#feature-sets
      collections: true,
      exotics: true,
      unicode: true,
      memoizing: true,
      flattening: true,
      paths: true,
      placeholders: true,
    }),
    // eslint-disable-next-line no-useless-escape
    new webpack.ContextReplacementPlugin(/date\-fns[\/\\]/, new RegExp(`[/\\\\\](${['en', 'vi'].join('|')})[/\\\\\]`)),
    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../public/*.*')],
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, './assets/manifest.webmanifest'),
        to: path.resolve(__dirname, '../public/manifest.webmanifest'),
      },
      {
        from: path.resolve(__dirname, './assets/fav/favicon.ico'),
        to: path.resolve(__dirname, '../public/favicon.ico'),
      },
    ]),
    new MiniCssExtractPlugin({
      // Thus you can import your Sass modules from `node_modules`.
      // Just prepend them with `~` to tell webpack that this is not a relative import
      // chunkFilename: "[id].css",
      filename: '[name].css',
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /(\.optimize)?\.css$/g,
      // cssProcessor: default is cssnano
      cssProcessorOptions: {
        preset: [
          'default',
          {
            sourceMap: true,
            reduceIdents: false,
            safe: true,
            discardComments: { removeAll: true },
          },
        ],
        sourceMap: true,
      },
    }),
    new webpack.ProvidePlugin({
      adbk: ['adbk', 'default'],
      core: ['core', 'default'],
    }),
    // new webpack.DefinePlugin({}),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      DEV: JSON.parse(process.env.DEV || 'false'),
      PORT: JSON.parse(process.env.PORT || 'null'),
      HOT_RELOAD: false,
      DEBUG: false,
    }),
  ],
  performance: {
    hints: 'warning',
    // maxEntrypointSize: 170000,
    // maxAssetSize: 100000,
  },
});

if (analyzingMode) {
  prodConfig.plugins.unshift(new BundleAnalyzerPlugin());
}

module.exports = prodConfig;
