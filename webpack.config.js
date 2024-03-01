const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development',
    entry: './src/scripts/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
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
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: { loader: 'babel-loader' }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
           { 
                test: /\.s[ac]ss$/i, 
                use: [ MiniCssExtractPlugin.loader , 'css-loader', 'sass-loader'] 
           },
           {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
         ],
    },
    plugins: [
        new TerserPlugin(),
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        })
    ]
}