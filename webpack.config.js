/// <binding BeforeBuild='Run - Development' AfterBuild='Run - Production' />
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlTemplatePath = './src/index.html';
const jsFileName = 'element.js';
const htmlFileName = 'index.html';

module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: jsFileName
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  devServer: {
    https: {
      key: fs.readFileSync('./server.key'),
      cert: fs.readFileSync('./server.cert')
    },
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: ['awesome-typescript-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: htmlTemplatePath,
      filename: htmlFileName,
      inject: 'body'
    })
  ],
  watchOptions: {
    ignored: /node_modules/
  }
};
