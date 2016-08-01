var webpack = require("webpack");
var dotenv = require("dotenv");

var WebpackHashPlugin = require("./webpack-hash-plugin");

var envConfig = dotenv.config();

module.exports = {
    entry: 'client/index.tsx',

    output: {
        filename: 'bundle.[chunkhash].js',
        path: 'public',
        publicPath: 'static'
    },

    resolve: {
        extensions: ["", ".tsx", ".ts", ".js", ".jsx"],
        modulesDirectories: ['src', 'node_modules']
    },

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.EnvironmentPlugin(Object.keys(envConfig)),
        new webpack.DefinePlugin({
            "process.env":{
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new WebpackHashPlugin()
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
