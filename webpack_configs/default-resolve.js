const path = require('path');

module.exports = {
	extensions: ['.ts', '.tsx', '.js', '.jsx'],
	alias: {
		components: path.resolve(global.rootPath, 'src/components/'),
		stores: path.resolve(global.rootPath, 'src/stores/'),
		rootDir: path.resolve(global.rootPath, 'src'),
	},
};