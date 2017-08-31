module.exports = {
    entry: './app.js',
    output: {
        // path: '',
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
        ]
    }
};