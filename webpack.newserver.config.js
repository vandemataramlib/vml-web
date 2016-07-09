var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

module.exports = {

    entry: path.resolve(__dirname, './src/server/index.tsx'),

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

    resolve: {
        extensions: ["", ".tsx", ".ts", ".js", ".jsx"]
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
            {
                test: /\.[jt]?sx?$/,
                exclude: /node_modules/,
                loaders: ['awesome-typescript']
            }
        ]
    }
};
