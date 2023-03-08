const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {  
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js'
    },
    devtool:'inline-sourcemap',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
                use: ['url-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
};