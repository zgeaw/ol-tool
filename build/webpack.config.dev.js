const path = require('path');
let webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VUE_APP_SYATEM_URL = 'http://172.16.10.222:31210';

const devConfig = {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, '../src/index.js')
  },
  devtool: 'inline-sourcemap',
  devServer: {
    host: '127.0.0.1',
    port: 8181,
    contentBase: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
        use: ['url-loader']
      },
      {
        test: /\.js$/,
        use: ['cache-loader', 'babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ // 定义变量
      VUE_APP_SYATEM_URL: JSON.stringify(VUE_APP_SYATEM_URL)
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
    })
  ]
};

module.exports = devConfig;