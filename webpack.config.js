const webpack = require('webpack');

module.exports = {
    entry: './src/client/index.tsx',

    output: {
        filename: 'bundle.js',
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
    ] : [],

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
