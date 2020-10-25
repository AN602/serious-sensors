import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as path from "path";
import * as CopyPlugin from "copy-webpack-plugin";

let srcDir = path.resolve(__dirname, "src");
let distDir = path.resolve(__dirname, "dist");

module.exports = {
    entry: {
        master: "master.ts",
        slave: "slave.ts"
    },

    output: {
        path: distDir,
        filename: "[name].js",
        chunkFilename: "[name].js"
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.html$/,
                use: "html-loader"
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },

    resolve: {
        extensions: [".js", ".ts"],
        modules: ["node_modules", srcDir]
    },

    devServer: {
        proxy: {
            "/api": {
                target: "ws://localhost:3000",
                ws: true
            }
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: "src/index.html",
            chunks: []
        }),
        new HtmlWebpackPlugin({
            filename: 'master.html',
            template: "src/master.html",
            chunks: ['master']
        }),
        new HtmlWebpackPlugin({
            filename: 'slave.html',
            template: "src/slave.html",
            chunks: ['slave']
        }),
        new CopyPlugin([{ from: "assets", to: "assets" }]),
        new CopyPlugin([{ from: "server/cert.pem", to: "" }]),
        new CopyPlugin([{ from: "server/key.pem", to: "" }])
    ]
};
