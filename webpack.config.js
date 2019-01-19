const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

module.exports = {
	entry: __dirname + "/index.js",
  output: {
    path: resolve('dist'),
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
      contentBase: __dirname,
      historyApiFallback: true,
      inline: true,
      hot: true,
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
          lib: __dirname + '/src',
          needGrass: true,
        },
      }],
      exclude: /node_modules/,
  	}, {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: [{
            loader: "css-loader",
            options: {
              modules: true,
            },
        }, {
            loader: "postcss-loader",
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-cssnext')(),
                require('autoprefixer')(),
                require('cssnano')(),
              ],
            },
        }],
      })
		}]
	},
	plugins: [
    new webpack.BannerPlugin('grass demo'),
    new webpack.DefinePlugin(setNpmAras()),
    new HtmlWebpackPlugin({
      template: __dirname + "/index.html"
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin("style.css"),
    new webpack.HotModuleReplacementPlugin(),
	]
}

function setNpmAras () {
  return {
    NODE_ENV: `'${process.env.NODE_ENV}'`
  }
}

function resolve (dir) {
  return path.resolve(__dirname, dir)
}