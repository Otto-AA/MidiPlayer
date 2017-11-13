const path = require('path');

const defaultModule = {
	loaders: [{
		test: /\.js$/,
		exclude: /node_modules/,
		loader: 'babel-loader',
		query: {
		presets: [['env', {
			targets: {
				browsers: ['last 2 versions', '> 1%']
			}
		}]],
		plugins: [
			'add-module-exports',
			'transform-object-rest-spread',
			['transform-runtime', {
				polyfill: false,
				regenerator: true
			}]
		]
		}
	}]
};
const defaultResolve = {
	modules: [
		path.resolve('./'),
		path.resolve('./node_modules')
	]
};

// Export MidiPlayer and MidiParser as libraries
module.exports = [
	{
		entry: {
			'build/MidiPlayer': './src/MidiPlayer.js'
		},
		output: {
			path: __dirname,
			filename: '[name].js',
			library: 'MidiPlayer',
			libraryTarget: 'umd'
		},
		module: defaultModule,
		resolve: defaultResolve
	},
	{
		entry: {
			'build/MidiParser': './src/MidiParser.js'
		},
		output: {
			path: __dirname,
			filename: '[name].js',
			library: 'MidiParser',
			libraryTarget: 'umd'
		},
		module: defaultModule,
		resolve: defaultResolve
	}
];