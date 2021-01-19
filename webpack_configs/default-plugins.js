const CopyPlugin = require('copy-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');

let defaultPlugins = [
	new WebpackNotifierPlugin(
		{
			title: 'Webpack',
			alwaysNotify: global.noisyMode,
			contentImage: path.join(__dirname, 'webpack.png')
		}),
	new MiniCssExtractPlugin({
		filename: global.isProduction ?"[name].[contenthash].css" : "[name].css",
	}),
	new ProgressBarPlugin(),
	new HtmlWebpackPlugin({
		template: './src/index.html',
		filename: 'index.html',
		inject: false,
	}),
	new CopyPlugin([
		{
			from: 'src/favicon.png',
			to: './favicon.png'
		},
	]),
];

if (global.isProduction) {
	defaultPlugins.push(new CleanWebpackPlugin());
}

module.exports = defaultPlugins;