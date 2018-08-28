const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
	entry: __dirname + "/index.js", //唯一入口文件
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "bundle.js"
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.vue', '.grs'],
    alias: {
      '@': resolve('./demo')
    }
  },
  devtool: 'source-map',
  devServer: {
      contentBase: __dirname, //本地服务器所加载的页面所在的目录
      historyApiFallback: true, //不跳转
      inline: true,
      hot: true, // 通过 --hot方式启动的话，不需要收到加 webpack.HotModuleReplacementPlugin 插件
      stats: "errors-only"
  },
  module: {
    rules: [{
      test: /(\.js|\.grs)$/,
      use: [{
        loader: "babel-loader",
      }, {
        loader: "grass-loader",
        options: {
          libPath: __dirname + '/src'
        },
      }],
      exclude: /node_modules/
  	}, {
      test: /\.css$/, // css 可以通过 @import 'xxx.scss';
      use: ExtractTextPlugin.extract({
        fallback: "style-loader", //当 CSS 没有被提取,采用的loader，感觉像是兼容
        use: [{
            loader: "css-loader",
            options: {
              modules: true,
            }
        }, {
            loader: "postcss-loader", // 添加浏览器兼容前缀
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-cssnext')(),
                require('autoprefixer')(),
                require('cssnano')() // 压缩css代码
              ]
            }
        }],
      })
		}]
	},
	plugins: [
    new webpack.BannerPlugin('xx'),
    new webpack.DefinePlugin(set_npm_args()),
    new HtmlWebpackPlugin({
        template: __dirname + "/index.html"
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin(), // 暂时不压缩代码
    new ExtractTextPlugin("style.css"), // 生成的css文件名字
    new webpack.HotModuleReplacementPlugin(),
	]
}

function set_npm_args () {
  return {
    NODE_ENV: `'${process.env.NODE_ENV}'`
  }
}

function resolve (dir) {
  return path.resolve(__dirname, dir)
}