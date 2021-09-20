var path = require('path');

module.exports = {
    entry: {
        app: './src/infinite.js'
    },
    output: {
        path: path.resolve(__dirname, 'dev'),
        filename: 'infinite_bundle.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                }
            }
        ]
    }
};

