const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const isProductionMode = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProductionMode ? 'production' : 'development',
    entry: {
        // core: ['@babel/polyfill', './core/js/index.js'],
        // App: './entrypoints/main/src/index.js',// for v2.0.0
        Signin: './entrypoints/signin/index.ssr.js',
        Signup: './entrypoints/signup/index.ssr.js'
    },
    output: {
        library: 'app',
        libraryTarget: 'commonjs2',
        path: path.resolve(__dirname, './ssr'),
        filename: '[name].ssr.js'// use entry property names, e.g: Signin.ssr.js
    },
    // externals: {// don't include these packages/modules in node_modules but use CDN, still have to import in each file
    //     'react': 'React',
    //     'react-dom': 'ReactDOM'
    // },
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals({
        whitelist: ['jssha', 'axios', 'react', 'react-dom', /^lodash/]
    })], // in order to ignore all modules in node_modules folder
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components|prototype)/,
                // include: [
                //     path.resolve(__dirname, './entrypoints/signin'),
                //     path.resolve(__dirname, './entrypoints/signup')
                //     // path.resolve(__dirname, 'entrypoints/**')
                // ],
                // options: {
                //     presets: ['env', 'react'],
                //     plugins: [
                //         'react-hot-loader/babel',
                //         'transform-object-rest-spread'
                //     ]
                // },
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        options: {
                            sourceMap: true
                        },
                        loader: 'css-loader'
                    }, {
                        options: {
                            sourceMap: true
                        },
                        loader: 'resolve-url-loader'
                    }, {
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('postcss-import')({ root: loader.resourcePath }),
                                require('postcss-preset-env')(),
                                require('autoprefixer')(),
                                // require('cssnano')({
                                //     reduceIdents: false,
                                //     safe: true,
                                //     discardComments: { removeAll: true }
                                // })
                            ],
                            sourceMap: true
                        },
                        loader: 'postcss-loader'
                    }, {
                        loader: 'sass-loader',
                        options: {
                            // includePaths: ['absolute/path/a', 'absolute/path/b'],
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                    //     options: {
                    //         // by default it use publicPath in webpackOptions.output
                    //         // publicPath: '../'
                    //         sourceMap: true
                    //     },
                    //     loader: MiniCssExtractPlugin.loader
                    // }, {
                        options: {
                            sourceMap: true
                        },
                        loader: 'css-loader'
                    }, {
                        options: {
                            sourceMap: true
                        },
                        loader: 'resolve-url-loader'
                    }, {
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('postcss-import')({ root: loader.resourcePath }),
                                require('postcss-preset-env')(),
                                require('autoprefixer')(),
                                // require('cssnano')({
                                //     reduceIdents: false,
                                //     safe: true,
                                //     discardComments: { removeAll: true }
                                // })
                            ],
                            sourceMap: true
                        },
                        loader: 'postcss-loader'
                    }
                ]
            },
            {
                test: /\.pug$/,
                exclude: path.resolve(__dirname, './node_modules/'),
                options: {
                    self: false,
                },
                loader: 'pug-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        options: {
                            limit: 8192
                        },
                        loader: 'url-loader'
                    },
                    {
                        options: {
                            disable: true, // webpack@2.x and newer
                        },
                        loader: 'image-webpack-loader'
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                loader: 'url-loader'
            }
        ]
    },
    devtool: isProductionMode ? 'source-map' : 'cheap-module-source-map',// use 'source-map' for production
    resolve: {
        extensions: ['.js'],
        alias: {
            'adbk': path.resolve(__dirname, './entrypoints/main/src/js/classes/adbk')  // <-- When you build or restart dev-server, you'll get an error if the path to your utils.js file is incorrect.
        }
    },
    plugins: [
        new CleanWebpackPlugin({
            dry: true,
            cleanOnceBeforeBuildPatterns: ['./ssr/*.*'],
            dangerouslyAllowCleanPatternsOutsideProject: false
        }),
        // new MiniCssExtractPlugin({// Thus you can import your Sass modules from `node_modules`.
        //                           // Just prepend them with `~` to tell webpack that this is not a relative import
        //     // chunkFilename: "[id].css",
        //     filename: "[name].css"
        // }),
        // new OptimizeCssAssetsPlugin({
        //     assetNameRegExp: /(\.optimize)?\.css$/g,
        //     // cssProcessor: default is cssnano
        //     cssProcessorOptions: {
        //         preset: ['default', {
        //             sourceMap: true,
        //             reduceIdents: false,
        //             safe: true,
        //             discardComments: { removeAll: true }
        //         }],
        //         sourceMap: true
        //     }
        // }),
        new webpack.ProvidePlugin({
            'adbk': ['adbk', 'default']
        }),
        new webpack.DefinePlugin({
            // NODE_ENV: JSON.stringify(isProductionMode ? 'production' : 'development'),
            'process.env.NODE_ENV': JSON.stringify(isProductionMode ? 'production' : 'development'),
            // __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
            // __PROD__: JSON.stringify(JSON.parse(process.env.BUILD_PROD || 'true')),
            // __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: isProductionMode ? 'production' : 'development',
            DEV: JSON.parse(process.env.DEV || 'false'),
            HOT_RELOAD: false,
            DEBUG: false
        }),
    ],
    performance: {
        // hints: 'error',
        // maxEntrypointSize: 400000,
        // maxAssetSize: 100000
    },
    optimization: {
        splitChunks: {
            // chunks: 'all'
        }//https://webpack.js.org/plugins/split-chunks-plugin/
    }
};
