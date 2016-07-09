"use script";

var webpack = require("webpack");
var fs = require("fs");
var path = require("path");

module.exports = {
    entry: './src/client/index.tsx',

    output: {
        filename: 'bundle.[chunkhash].js',
        publicPath: 'static',
        path: 'public'
    },

    resolve: {
        extensions: ["", ".tsx", ".ts", ".js", ".jsx"]
    },

    plugins: process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ] : [
        function () {
            this.plugin("done", function (stats) {
                var outputFile = "build/webpack.hash.json";
                try {
                    fs.accessSync(outputFile, fs.W_OK);
                    var bundleName = JSON.parse(fs.readFileSync(outputFile)).main;
                    if (bundleName !== stats.toJson().assetsByChunkName.main) {
                        fs.unlinkSync("public/" + bundleName);
                    }
                } catch (err) {
                    console.log(outputFile, "not found");
                }
                fs.writeFileSync(
                    path.join(__dirname, outputFile),
                    JSON.stringify(stats.toJson().assetsByChunkName)
                );
            })
        }
    ],

    module: {
        loaders: [
            {
                test: /\.[jt]?sx?$/,
                exclude: /node_modules/,
                loaders: ['awesome-typescript']
            }
        ]
    }
};
