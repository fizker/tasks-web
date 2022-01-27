const path = require("path")
const webpack = require("webpack")

const config = {
	mode: process.NODE_ENV ?? "development",
	output: {
		path: path.join(__dirname, "static"),
		filename: "bundle.js",
	},
	module: {
		rules: [
			{
				test: /.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [ "@babel/preset-env" ],
					}
				},
			},
		],
	},
	devtool: "eval",
}

module.exports = config
