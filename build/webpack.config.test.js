const path = require('path');
let webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Terser = require('terser');
const VUE_APP_SYATEM_URL = 'http://172.16.10.222:31210';


const prodConfig = {
  mode: 'production',
  entry: {
    Bimfish: path.resolve(__dirname, '../src/bimfishApp.js'),
    index: path.resolve(__dirname, '../src/index.js'),
    bimInit: path.resolve(__dirname, '../src/bimInit.js')
  },
  output: {
    //library: 'BimfishApp',
    // publicPath: '/static/',
    // path: path.resolve(__dirname, '../dist'),
    // filename: '[name].js'
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
        use: ['babel-loader']
      }
    ]
  },
  externals: {
    THREE: 'window.THREE',
    jquery: 'window.jQuery',
    $: 'window.$'
  },
  plugins: [
    new webpack.DefinePlugin({ // 定义变量
      VUE_APP_SYATEM_URL: JSON.stringify(VUE_APP_SYATEM_URL)
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, '../models'), to: path.resolve(__dirname, '../dist/models') },
      { from: path.resolve(__dirname, '../models/svf2'), to: path.resolve(__dirname, '../dist') },
      { from: path.resolve(__dirname, '../assets'), to: path.resolve(__dirname, '../dist/assets') },
      { from: path.resolve(__dirname, '../thirdpart'), to: path.resolve(__dirname, '../dist/thirdpart') },
      { from: path.resolve(__dirname, '../src/lib'), to: path.resolve(__dirname, '../dist') }
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      chunks: ['index'],
    })
  ]
};

module.exports = prodConfig;