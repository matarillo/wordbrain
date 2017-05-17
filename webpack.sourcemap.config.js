module.exports = {
    entry: './app.ts',
    output: {
        filename: 'dist/bundle.js',
        path: __dirname
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                use: "source-map-loader"
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js,"]
    },
    devtool: 'inline-source-map'
};