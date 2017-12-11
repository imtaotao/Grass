const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const path = require('path')

module.exports = {
	entry: __dirname + "/index.js", //已多次提及的唯一入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js"
  },
  devtool: 'none',
  devServer: {
      contentBase: __dirname, //本地服务器所加载的页面所在的目录
      historyApiFallback: true, //不跳转
      inline: true,
      hot: true
  },
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      use: {
          loader: "babel-loader"
      },
      exclude: /node_modules/
  	}, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
            loader: "css-loader",
            options: {
              modules: true
            }
        }, {
            loader: "postcss-loader"
        }],
      })
		}]
	},
	plugins: [
    new webpack.BannerPlugin('taotao的虚拟dom研究😊'),
    new HtmlWebpackPlugin({
        template: __dirname + "/index.html" 
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin(), // 暂时不压缩代码
    new ExtractTextPlugin("style.css"),
    new webpack.HotModuleReplacementPlugin(),
	]
}