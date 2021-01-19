const fs = require('fs');

module.exports = env => {
	global.NODE_ENV = env || 'production';
	global.isProduction = global.NODE_ENV === 'production';
	let targets = [];
	global.rootPath = __dirname;

	global.noisyMode = true;

	targets.push(require(`./webpack_configs/main`));

	return targets;
};