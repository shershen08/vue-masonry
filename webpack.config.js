const UglifyEsPlugin = require('uglify-es-webpack-plugin');
const webpack = require('webpack');

module.exports = {
     entry: './index.js',
          output: {
         path: __dirname,
         filename: 'dist/vue-masonry-plugin.js',
     },
     module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader',
              query: {
                presets: ['es2015']
            }
         }]
     },
    plugins: [
        new UglifyEsPlugin(),
        new webpack.BannerPlugin({
            banner: "Vue.js plugin for Masonry layouts \n https://github.com/shershen08/vue-masonry/ \n file:[file]"
        })
    ]
 }