/// <binding BeforeBuild='Run - Development' AfterBuild='Run - Production' />
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const makeSourceMaps = isProduction ? false : 'cheap-module-eval-source-map';
const getDevSuffix = isProduction ? '' : 'Dev';

const htmlTemplatePath = `./src/templates/index${getDevSuffix}.html`;

module.exports = {
    mode: process.env.NODE_ENV,
    devtool: makeSourceMaps,
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: `element${isProduction ? '.min' : ''}.js`
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
                        loader: "style-loader"
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },

            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: htmlTemplatePath,
            filename: `element${getDevSuffix}.html`,
            inject: 'body'
        })
    ]
};