const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    'blocks/blocks.min': path.resolve(__dirname, './build/blocks/blocks.js'),
		'blocks/blocks-frontend.min': path.resolve(__dirname, './build/blocks/blocks-frontend.js'),

		'blocks-professional/blocks.min': path.resolve(__dirname, './build/blocks-professional/blocks.js'),
		'blocks-professional/blocks-frontend.min': path.resolve(__dirname, './build/blocks-professional/blocks-frontend.js'),
  },
  mode: 'none',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  plugins: [
		new webpack.ProvidePlugin({
			jQuery: "jquery",
			wp: 'wp'
		}),
	  new UglifyJsPlugin({
			include: /\.min\.js$/,
    })
  ],
  externals: {
		jquery: 'jQuery',
		wp: 'wp'
  },
  resolve: {
		modules: [
			'node_modules',
		],
	},
	module: {
	  rules: [
	    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader", include: path.resolve(__dirname, "build") }
	  ]
	}
};
