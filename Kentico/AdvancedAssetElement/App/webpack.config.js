/// <binding BeforeBuild='Run - Development' />
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'element.html',
    inject: 'body'
});

const usedevtool = process.env.NODE_ENV === 'production' ? false : 'cheap-module-eval-source-map';

module.exports = {
    mode: process.env.NODE_ENV,
    devtool: usedevtool,
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'element.js'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
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
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
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