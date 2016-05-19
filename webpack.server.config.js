const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {

    entry: path.resolve(__dirname, './src/server/index.js'),

    output: {
        filename: 'server.bundle.js',
        path: 'build'
    },

    target: 'node',

    // keep node_module paths out of the bundle
    externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
        'react-dom/server', 'react/addons'
    ]).reduce((ext, mod) => {

        ext[mod] = 'commonjs ' + mod;
        return ext;
    }, {}),

    node: {
        __filename: true,
        __dirname: true
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'SERVER': true
            }
        })
    ],

    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' }
        ]
    }

};
