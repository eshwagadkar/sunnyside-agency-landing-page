const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const fse = require("fs-extra")

const isProduction = process.env.NODE_ENV == 'production'

// Access the fields to configure webpack
const pkgVars = require('./package.json')

// Destructure variables from pkgVars.config
const {entry, sourceDir, buildDir, port} = pkgVars.config

const browserCacheHandler = isProduction ? 'bundle.[contenthash].js' : 'bundle.js'
const outputBundleHandler = isProduction ? buildDir : sourceDir
const stylesHandler = isProduction ? MiniCssExtractPlugin.loader : 'style-loader'

class RunAfterCompile{
    apply(compiler) {
        compiler.hooks.done.tap('Copy images', () => {
            fse.copySync(`./${sourceDir}/images`, `./${buildDir}/images`)
        })
    }
}
// SHARED CONFIG
const config = {
    entry: `./${sourceDir}/scripts/index.js`,
    output: {
        filename: browserCacheHandler,
        path: path.resolve(__dirname, outputBundleHandler),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: { loader: 'babel-loader',
                 options: {
                    presets: [ '@babel/preset-react', '@babel/preset-env']
                   }
                },
            },
            {
                test: /\.css$/i,
                use: [ stylesHandler, 'css-loader' ]
            },
            { 
                test: /\.s[ac]ss$/i, 
                use: [ stylesHandler, 'css-loader', 'sass-loader'] 
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
            template: `./${sourceDir}/index.hbs`,
            description: 'Some Description'
        })
    ],
    optimization: {
        minimizer: [
          // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
          //   `...`,
        ],
      }
}

module.exports = () => {
    // PRODUCTION CONFIG
    if (isProduction) { 
        config.mode = 'production';
        config.plugins.push(
            new MiniCssExtractPlugin({ filename: 'styles.[contenthash].css' }), 
            new CleanWebpackPlugin(),
            new RunAfterCompile()
        ); 
        config.optimization.minimizer.push(new CssMinimizerPlugin())
    // DEVELOPMENT CONFIG
    } else {  
        config.mode = 'development';
        config.devServer = {
            static: `./${buildDir}/` ,
            // watchFiles: [`./${sourceDir}/index.hbs`],
            hot: true,
            port,
            open: true,
            compress: true,
            historyApiFallback: true,
            host: '0.0.0.0'
        }
    }
    return config
}