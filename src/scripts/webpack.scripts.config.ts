import path from 'path';
import webpack from 'webpack';

const config: webpack.Configuration = {
    devtool: 'eval-source-map',
    entry: path.resolve(__dirname, '../app.ts'),
    output: {
        publicPath: path.resolve(__dirname, '../../dist'),
        path: path.resolve(__dirname, '../../dist'),
        filename: 'comic-viewer.js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.json'],
        alias: {
            '@': path.resolve(__dirname, '../../src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.less$/i,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            NODE_ENV: `"${process.env.NODE_ENV}"`,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.CleanPlugin(),
    ],
    target: 'web',
    mode: 'development',
};

export default config;
