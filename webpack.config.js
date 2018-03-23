const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
	// mode: 'production',
	devtool: 'source-map',
	target: 'node',
	entry: './src/index',
	output: {
		libraryTarget: 'umd',
		path: path.resolve('./dist'),
		filename: 'index.js',
	},
	externals: nodeExternals(),
	module: {
		rules: [
			{
				test: /\.js?$/,
				use: 'babel-loader',
				exclude: '/node_modules/',
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production'),
			},
		}),
		new UglifyJsPlugin({
			sourceMap: true,
			parallel: true,
			uglifyOptions: {
				keep_fnames: true,
			},
		}),
	],
};
