import path from 'path';
import webpack from 'webpack';

const cssLoader = {
    loader: 'css-loader',
    options: {
        modules: {
            localIdentName: '[local]-[hash:5]',
        },
    },
};

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
                use: ['style-loader', cssLoader, 'less-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', cssLoader],
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
    mode: 'production',
};

export default config;
