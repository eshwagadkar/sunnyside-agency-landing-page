const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/scripts/index.js',
    output: {
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'src'),
    },

    devServer: {
        static:{
            directory: path.join(__dirname, 'src'),
        } ,
        hot: true,
        port: 3001,
        open: true,
        compress: true,
        historyApiFallback: true,
        host: '0.0.0.0'
    },
    module: {
        rules: [
           { 
                test: /\.scss$/i, 
                use: [ 'style-loader', 'css-loader', 'sass-loader'] 
           },
           {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
         ],
    }
}