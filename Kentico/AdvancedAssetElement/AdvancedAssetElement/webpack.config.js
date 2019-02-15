/// <binding BeforeBuild='Run - Development' />
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'element.html',
    inject: 'body'
});

module.exports = {
    mode: process.env.NODE_ENV,
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'element.js'
    },
    module: {
        rules: [
            //{
            //    test: /\.css$/,
            //    use: [
            //        { loader: "style-loader" },
            //        { loader: "css-loader" }
            //    ]
            //},
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        HtmlWebpackPluginConfig
    ]
};