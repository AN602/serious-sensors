import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';

const { AureliaPlugin } = require('aurelia-webpack-plugin');

let srcDir = path.resolve(__dirname, 'src');
let distDir = path.resolve(__dirname, 'dist');

module.exports = {
    entry: {
        app: 'aurelia-bootstrapper'
    },

    output: {
        path: distDir,
        filename: '[name].js',
        chunkFilename: '[name].js'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },

    resolve: {
        extensions: [
            '.js',
            '.ts'
        ],
        modules: [
            'node_modules',
            srcDir
        ]
    },

    devServer: {
        proxy: {
            '/api': {
                target: 'ws://localhost:3000',
                ws: true
            }
        }
    },

    plugins: [
        new AureliaPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
}
