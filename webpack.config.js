const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack')

const libraryName = 'vue-masonry-plugin'
const buildTarget = process.env.TARGET === 'umd' ? 'umd' : 'window'
const outputFile = `${libraryName}-${buildTarget}.js`
const tagline = 'Vue.js plugin for Masonry layouts'

module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: buildTarget,
    umdNamedDefine: true
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          output: {comments: new RegExp(tagline, 'i')}
        }
      })
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `${tagline} \n https://github.com/shershen08/vue-masonry/ \n file:[file]`
    })
  ]
}
