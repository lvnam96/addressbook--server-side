const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const productionMode = process.env.NODE_ENV === 'production';

module.exports = {
    mode: 'development',
    entry: {
        core: '../../core/js/index.js',
        App: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'// use entry property names, e.g: Signin.js
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/(node_modules|bower_components)/, './prototype/'],
                // include: [
                //     path.resolve(__dirname, './src')
                // ],
                options: {
                    presets: ['env', 'react'],
                    plugins: ['react-hot-loader/babel', require('babel-plugin-transform-object-rest-spread')]
                },
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        options: {
                            sourceMap: true
                        },
                        loader: 'style-loader'
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
                    // }, {
                    //     options: {
                    //         ident: 'postcss',
                    //         plugins: (loader) => [
                    //             require('postcss-import')({ root: loader.resourcePath }),
                    //             require('postcss-preset-env')(),
                    //             require('autoprefixer')(),
                    //             // require('cssnano')({
                    //             //     reduceIdents: false,
                    //             //     safe: true,
                    //             //     discardComments: { removeAll: true }
                    //             // })
                    //         ],
                    //         sourceMap: true
                    //     },
                    //     loader: 'postcss-loader'
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
                        loader: 'style-loader'
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
                            bypassOnDebug: true, // webpack@1.x
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
    devtool: 'cheap-module-source-map',// use 'source-map' for production
    devServer: {
        // proxy: {
        //
        // },
        hot: true,
        compress: false,
        port: 2711,
        // https: true,// true for self-signed, object for cert authority
        contentBase: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CleanWebpackPlugin(['./dist/*.*'], {
            allowExternal: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.pug',
            chunks: ['core', 'App'],
            // favicon: './fav/favicon.ico',
            title: 'Address Book',
            prod: false
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'signin.html',
        //     template: './signin.pug',
        //     chunks: ['core', 'Signin'],
        //     // favicon: '../public/favicon.ico',
        //     title: 'Sign In',
        //     prod: false
        // }),
        // new HtmlWebpackPlugin({
        //     filename: 'signup.html',
        //     template: './signup.pug',
        //     chunks: ['core', 'Signup'],
        //     // favicon: '../public/favicon.ico',
        //     title: 'Sign Up',
        //     prod: false
        // }),
        new MiniCssExtractPlugin({// Thus you can import your Sass modules from `node_modules`.
                                  // Just prepend them with a ~ to tell webpack that this is not a relative import
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
        splitChunks: {}//https://webpack.js.org/plugins/split-chunks-plugin/
    }
};
