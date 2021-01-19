const path = require('path');
const DEFAULT_LOADERS = require('./default-loaders');
const DEFAULT_PLUGINS = require('./default-plugins');
const DEFAULT_RESOLVE = require('./default-resolve');
const PUBLIC_PATH = '/';

module.exports = {
	context: global.rootPath,
	watchOptions: {
		aggregateTimeout: 100,
	},
	devServer: {
		historyApiFallback: true,
		compress: true,
		port: 8182,
		contentBase: './bundle',
	},
	devtool: global.isProduction
				? false
				: 'eval-source-map',
	entry: {
		'source': path.join(global.rootPath, 'src', 'index.tsx'),
	},
	output: {
		filename: global.isProduction ? '[name].[chunkhash].js' : '[name].js',
		path: path.join(global.rootPath, 'bundle'),
		publicPath: PUBLIC_PATH
	},
	module: {
		rules: DEFAULT_LOADERS
	},
	plugins: DEFAULT_PLUGINS,
	resolve: DEFAULT_RESOLVE,
	optimization: {
		splitChunks: {
			minSize: 0,
			cacheGroups: {
				vendor: {
					test: /([\\/]node_modules[\\/]|[\\/]vendor[\\/])/,
					name: 'vendor',
					chunks: 'all',
				},
			}
		}
	}
};