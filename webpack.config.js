const HtmlWebPackPlugin     = require('html-webpack-plugin');
const MiniCssExtractPlugin  = require("mini-css-extract-plugin");
const CopyPlugin            = require("copy-webpack-plugin");
const CssMinimizerPlugin    = require("css-minimizer-webpack-plugin");
const TerserPlugin          = require("terser-webpack-plugin");

const  rulesForJavaScript   = {
    test: /\.m?js$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: {
            presets: ['@babel/preset-env']
        }
    }
}

const rulesForHTML  = {
    test: /\.html$/,
    loader: 'html-loader',
    options: {
        sources: false
    }
}

const rulesForStyles = {
    test: /\.css$/,
    exclude: /styles.css$/,
    use: ['style-loader', 'css-loader']
}

const rulesForStylesGlobal = {
    test: /styles.css$/,
    use: [MiniCssExtractPlugin.loader, "css-loader"],
}

const rulesForFiles = {
    test: /\.(png|jpe?g|gif)$/,
    loader: 'file-loader',
}

const rules = [ rulesForHTML, rulesForStyles, rulesForStylesGlobal, rulesForFiles, rulesForJavaScript ];

module.exports = (env, argv) => {
    const {mode}            = argv;
    const isProduction      = mode === 'production';
    const optimizationValue = isProduction ? {minimize: true, minimizer: [ new CssMinimizerPlugin(), new TerserPlugin()]} : {};

    return {

        output: {
            filename: isProduction ? '[name].[contenthash].js' : 'main.js',
            clean: true // Limpia la carpeta dist y vuelve a generar los archivos
        },

        module: { rules },

        optimization: optimizationValue,

        plugins: [
            new HtmlWebPackPlugin({ 
                template: 'src/index.html'
            }),

            new MiniCssExtractPlugin({
                filename: isProduction ? '[name].[contenthash].css' : '[name].css' 
            }),
            new CopyPlugin({
                patterns: [
                { from: "src/assets/", to: "assets/" },
                ],
            })
        ]
    }

    

}