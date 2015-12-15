'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
	context: path.join(__dirname, 'public/components'),
	entry: {
		vendor: ['bluebird', 'lodash', 'superagent-extend', 'debug'],
		global: ['./global.js']
	},
	output: {
		path: path.join(__dirname, 'assets/components'),
		filename: '[name].js'
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
	]
};