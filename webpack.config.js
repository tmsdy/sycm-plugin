const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MangleJsClassPlugin = require('mangle-js-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const path = require('path')
module.exports = {
  // devtool: 'inline-source-map',
  mode:'production',
  entry: {
    // content-scripts
    'content-script.js': ['./plugins/js/contentModule/index.js', './plugins/js/contentModule/variableAnaly.js'],
    'content-script1.js': ['./plugins/js/contentModule/monitor.js', './plugins/js/contentModule/market.js'],
    'contentScript.js': './plugins/js/contentScript.js',
    'chaqz_web.js': './plugins/js/chaqz_web.js',
    'chaqz.js': './plugins/js/chaqz.js',

    // background-scripts
    'background.js': './plugins/js/background.js',

  },
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: './[name]'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      // {
      //   test: require.resolve('jquery'), //require.resolve 用来获取模块的绝对路径
      //   use: [{
      //     loader: 'expose-loader',
      //     options: 'jQuery'
      //   }, {
      //     loader: 'expose-loader',
      //     options: '$'
      //   }]
      // }
    ]
  },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         chunks: "all",
  //         minChunks: 1,
  //         maxInitialRequests: 5, // The default limit is too small to showcase the effect
  //         minSize: 0 // This is example is too small to create commons chunks
  //       }
  //     }
  //   }
  // },
   plugins: [
     new UglifyJSPlugin(),
      // new CleanWebpackPlugin(),
      // new webpack.ProvidePlugin({
      //   $: 'jquery',
      //   jQuery: 'jquery',
      //   'window.jQuery': 'jquery',
      //   'window.$': 'jquery'
      // })
   ]
};