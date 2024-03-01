const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isProduction = process.env.NODE_ENV == 'production';

const browserCacheHandler = isProduction ? 'bundle.[contenthash].js' : 'bundle.js';
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const config = {
    entry: './src/scripts/index.js',
    output: {
        filename: browserCacheHandler,
        path: path.resolve(__dirname, './dist'),
    },
    devServer: {
        static:{
            directory: path.join(__dirname, './dist'),
        } ,
        watchFiles: [`./${sourceDir}/index.hbs`],
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
                use: [ stylesHandler, 'css-loader' ]
            },
            { 
                test: /\.s[ac]ss$/i, 
                use: [ stylesHandler , 'css-loader', 'sass-loader'] 
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.hbs$/,
                use: [
                    'handlebars-loader'
                ]
            }
         ],
    },
    plugins: [
        // new CleanWebpackPlugin({
        //     cleanOnceBeforeBuildPatterns: [
        //         "**/*", // Default Option
        //         // path.join(process.cwd(), 'build/**/*')
        //     ]
        // }),
        new HtmlWebpackPlugin({
            title: 'Sunny-Side-Landing-Page',
            template: 'src/index.hbs',
            description: 'Some Description'
        })

    ]
}

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        config.plugins.push(new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' }), new CleanWebpackPlugin()); 
    } else {
        config.mode = 'development';
    }
    return config;
};