const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
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
	new WorkboxPlugin.InjectManifest({
		swSrc: "./src/PWA/sw.js",
		maximumFileSizeToCacheInBytes: 100*1024*1024,
		exclude: [],
	}),
	new HtmlWebpackPlugin({
		template: './src/index.html',
		filename: 'index.html',
		inject: false,
	}),
	new WebpackPwaManifest({
		fingerprints: false,
		inject: true,
		ios: true,
		name: "Bubbles",
		short_name: 'Bubbles',
		description: 'Bubbles',
		background_color: '#190053',
		orientation: "any",
		crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
		//start_url: ".",
		icons: [
			{
				src: path.resolve('src/icon.png'),
				sizes: [128, 512] // multiple sizes
			},
		],
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