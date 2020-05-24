var path = require('path');

module.exports = {
    entry: {
        app: './src/infinite.js'
    },
    output: {
        path: path.resolve(__dirname, 'dev'),
        filename: 'infinite_bundle.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        "@babel/plugin-proposal-class-properties"
                    ]
                }
            }
        ]
    }
};