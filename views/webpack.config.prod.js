const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const productionMode = process.env.NODE_ENV === 'production';

module.exports = {
    mode: 'production',//https://webpack.js.org/configuration/#use-different-config-file
    entry: {
        core: './core/js/index.js',
        App: './entrypoints/main/src/index.js',
        Signin: './entrypoints/signin/index.js',
        Signup: './entrypoints/signup/index.js'
    },
    output: {
        path: path.resolve(__dirname, '../public'),
        filename: '[name].js'// use entry property names, e.g: Signin.js
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/(node_modules|bower_components)/, './prototype/'],
                // include: [
                //     path.resolve(__dirname, './entrypoints/signin'),
                //     path.resolve(__dirname, './entrypoints/signup')
                //     // path.resolve(__dirname, 'entrypoints/**')
                // ],
                options: {
                    presets: ['env', 'react'],
                    plugins: ['react-hot-loader/babel']
                },
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        options: {
                            // by default it use publicPath in webpackOptions.output
                            // publicPath: '../'
                            sourceMap: true
                        },
                        loader: MiniCssExtractPlugin.loader
                    }, {
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
                        options: {
                            // by default it use publicPath in webpackOptions.output
                            // publicPath: '../'
                            sourceMap: true
                        },
                        loader: MiniCssExtractPlugin.loader
                    }, {
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
                exclude: ['./node_modules/'],
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
    plugins: [
        new CleanWebpackPlugin(['../public/*.*'], {
            allowExternal: true
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: './index.pug',
        //     chunks: ['core', 'App'],
        //     // favicon: '../public/favicon.ico',
        //     // minify: true,
        //     // hash: true,
        //     title: 'Address Book',
        //     isSignedIn: true,
        //     prod: false
        // }),
        // new HtmlWebpackPlugin({
        //     filename: 'signin.html',
        //     template: './signin.pug',
        //     chunks: ['core', 'Signin'],
        //     // favicon: '../public/favicon.ico',
        //     // minify: true,
        //     // hash: true,
        //     title: 'Sign In',
        //     prod: true
        // }),
        // new HtmlWebpackPlugin({
        //     filename: 'signup.html',
        //     template: './signup.pug',
        //     chunks: ['core', 'Signup'],
        //     // favicon: '../public/favicon.ico',
        //     // minify: true,
        //     // hash: true,
        //     title: 'Sign Up',
        //     prod: true
        // }),
        new MiniCssExtractPlugin({// Thus you can import your Sass modules from `node_modules`.
                                  // Just prepend them with `~` to tell webpack that this is not a relative import
            // chunkFilename: "[id].css",
            filename: "[name].css"
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /(\.optimize)?\.css$/g,
            // cssProcessor: default is cssnano
            cssProcessorOptions: {
                preset: ['default', {
                    sourceMap: true,
                    reduceIdents: false,
                    safe: true,
                    discardComments: { removeAll: true }
                }],
                sourceMap: true
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
            __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
        }),
    ],
    optimization: {
        splitChunks: {
            // chunks: 'all'
        }//https://webpack.js.org/plugins/split-chunks-plugin/
    }
};
