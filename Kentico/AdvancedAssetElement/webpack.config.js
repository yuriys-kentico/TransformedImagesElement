/// <binding BeforeBuild='Run - Production' />
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

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

            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true, // this option must be enabled
                            localIdentName: '[local]',
                            exportOnlyLocals: true
                        }
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'typed-css-modules-loader'
            },

            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            }
            //{
            //    enforce: "pre",
            //    test: /\.js$/,
            //    loader: "source-map-loader"
            //},
            //{
            //    test: /\.js$/,
            //    exclude: /node_modules/,
            //    use: {
            //        loader: 'babel-loader'
            //    }
            //},
            //{
            //    test: /\.jsx?$/,
            //    exclude: /node_modules/,
            //    use: {
            //        loader: 'babel-loader'
            //    }
            //}
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'element.html',
            inject: 'body'
        })
    ]
};