const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CSS_LOADERS = [
	{
		loader: MiniCssExtractPlugin.loader,
	},
	{
		loader: 'css-loader',
		options: {
			minimize: global.isProduction,
		}
	},
	{
		loader: 'postcss-loader',
		options: {
			sourceMap: global.isProduction,
			plugins: () => [
				require('autoprefixer')
			]
		}
	},
	{
		loader: 'resolve-url-loader',
	},
];

const CSS_LOADERS_MODULES = [
	'style-loader',
	{
		loader: 'css-loader',
		options: {
			minimize: global.isProduction,
			modules: {
				auto: (resourcePath) => true,
				localIdentName: global.isProduction ? '[path][name]__[local]' : '[hash:base64]',
			},
		}
	},
	{
		loader: 'postcss-loader',
		options: {
			sourceMap: global.isProduction,
			plugins: () => [
				require('autoprefixer')
			]
		}
	},
	{
		loader: 'resolve-url-loader',
	},
];

let STYLUS_LOADER = CSS_LOADERS.concat([
	{
		loader: 'stylus-loader'
	}
]);

let STYLUS_LOADER_MODULES = CSS_LOADERS_MODULES.concat([
	{
		loader: 'stylus-loader'
	}
]);

let SASS_LOADER = CSS_LOADERS.concat([
	{
		loader: 'sass-loader' // compiles Sass to CSS
	}
]);

module.exports = [
	{
		test: /\.(js|jsx|mjs|ts|tsx)$/,
		exclude: /node_modules/,
		use: {
			loader: 'babel-loader',
		}
	},
	{
		test: /\.(jpg|jpeg|flr)$/,
		use: [
			{
				loader: 'file-loader',
				options: {
					name: 'images/[hash].[ext]',
					outputPath: './',
				},
			}
		]
	},
	{
		test: /\.css$/,
		use: CSS_LOADERS,
	},
	{
		test: /\.module\.styl$/,
		use: STYLUS_LOADER_MODULES
	},
	{
		test: /\.styl$/,
		exclude: /\.module\.styl$/,
		use: STYLUS_LOADER
	},
	{
		test: /\.(sass|scss)$/,
		use: SASS_LOADER
	},
	{
		test: /\.(eot|ttf|woff|woff2)$/,
		use: [
			{
				loader: 'file-loader',
				options: {
					name: 'fonts/[name].[ext]',
					outputPath: './',
				},
			}
		]
	},
	{
		test: /\.(svg|gif|png)$/,
		use: [
			{
				loader: 'url-loader',
				options: {
					limit: 8192,
					name: 'images/[hash].[ext]',
					outputPath: './',
				}
			}
		]
	},
	{
		test: /\.mp3$/,
		use: [
			{
				loader: 'file-loader',
				options: {
					name: 'audio/[hash].[ext]',
					outputPath: './',
				},
			}
		]
	},
];