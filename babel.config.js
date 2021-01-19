module.exports = api => {

	const isTest = api.env("test");

	let result = {};

	result.plugins = [
		"@babel/plugin-transform-modules-commonjs",
		["@babel/plugin-transform-runtime", {
			//useESModules: true
		}],
		"@babel/plugin-proposal-object-rest-spread",
		["@babel/plugin-proposal-decorators", { "legacy": true }],
		["@babel/plugin-proposal-class-properties", { "loose": true }],
	];

	result.presets = [
		"@babel/preset-env",
		"@babel/typescript",
		"@babel/preset-react",
	];

	if (isTest) {
		global.rootPath = __dirname;
		const bundleVersion = process.env.TEST_VERSION;
		const testTarget = process.env.TEST_TARGET;

		const aliases = require(`./webpack_configs/${bundleVersion}/${testTarget}/default-resolve`).alias;

		result.plugins.push(
			["module-resolver", {
				"root": [__dirname],
				"alias": aliases
			}]
		);
	}

	return result;
};