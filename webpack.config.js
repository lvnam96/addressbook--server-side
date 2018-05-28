const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['react-hot-loader', 'babel-loader']
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            }
        ],
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": ["react", "es2015"],
                        "plugins": [require('babel-plugin-transform-object-rest-spread')],
                        "env": {
                            "production": {
                                "plugins": [
                                    require('babel-plugin-transform-object-rest-spread')
                                    [
                                        "transform-react-remove-prop-types",
                                        {
                                            "ignoreFilenames": ["node_modules"]
                                        }
                                    ]
                                ]
                            }
                        }
                    }
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ]
};

// const NODE_ENV = 'production',
//     isProduction = (NODE_ENV === 'production'),
//     outputPath = path.join(__dirname, 'build'),
//     serverPort = '3000',
//     outputFileName = 'bundle.js';

// module.exports = {
//     entry: './index.js',
//     output: {
//         path: outputPath,
//         filename: outputFileName
//     },
//     devtool: isProduction ? null : 'source-map',
//     devServer: {
//         outputPath: outputPath,
//         contentBase: './',
//         port: serverPort,
//         hot: true,
//         stats: { colors: true },
//         filename: outputFileName
//     },
//     module: {
//         loaders: [
//             {
//                 test: /\.js$/,
//                 exclude: /node_modules/,
//                 loaders: ['react-hot-loader', 'babel-loader']
//             },
//             {
//                 test: /\.scss$/,
//                 loader: 'style-loader!css-loader!sass-loader'
//             }
//         ],
//         rules: [
//             {
//                 test: /\.js$/,
//                 exclude: /(node_modules|bower_components)/,
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         "presets": ["react", "es2015"],
//                         "plugins": [require('babel-plugin-transform-object-rest-spread')],
//                         "env": {
//                             "production": {
//                                 "plugins": [
//                                     require('babel-plugin-transform-object-rest-spread')
//                                     [
//                                     "transform-react-remove-prop-types",
//                                     {
//                                         "ignoreFilenames": ["node_modules"]
//                                     }
//                                     ]
//                                 ]
//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 test: /\.scss$/,
//                 use: ExtractTextPlugin.extract({
//                     fallback: 'style-loader',
//                     use: ['css-loader', 'sass-loader']
//                 })
//             }
//         ]
//     },
//     plugins: [
//         new ExtractTextPlugin('style.css')
//     ]
// };
