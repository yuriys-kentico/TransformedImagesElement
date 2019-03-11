/// <binding BeforeBuild='Run - Development' AfterBuild='Run - Production' />
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const makeSourceMaps = isProduction ? false : 'cheap-module-eval-source-map';
const getDevSuffix = isProduction ? '' : 'Dev';

const htmlTemplatePath = "./src/templates/index.html";
const jsFileName = `element${getDevSuffix}.js`;
const cssFileName = `style${getDevSuffix}.css`;
const htmlFileName = `element${getDevSuffix}.html`;

module.exports = {
    mode: process.env.NODE_ENV,
    devtool: makeSourceMaps,
    entry: './src/index',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: jsFileName
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },

            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin(cssFileName),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /^((?!Dev).)*\.css/
        }),
        new HtmlWebpackPlugin({
            template: htmlTemplatePath,
            filename: htmlFileName,
            inject: 'body'
        })
    ]
};