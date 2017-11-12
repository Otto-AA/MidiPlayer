const path = require('path');

 module.exports = {
     entry: {
		 'build/MidiPlayer': './src/MidiPlayer.js',
	 },
     output: {
         path: __dirname,
         filename: '[name].js',
         library: 'MidiPlayer',
         libraryTarget: 'umd'
     },
	 module: {
		 loaders: [{
			 test: /\.js$/,
			 exclude: /node_modules/,
			 loader: 'babel-loader',
			  query: {
				presets: ['env'],
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
	 },
	 resolve: {
		 modules: [
			 path.resolve('./'),
			 path.resolve('./node_modules')
		 ]
	 }
 };