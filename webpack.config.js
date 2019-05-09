const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MangleJsClassPlugin = require('mangle-js-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
  // devtool: 'inline-source-map',
  mode:'production',
  entry: {
    // content-scripts
    'content-script.js': ['./src/plugins/contentModule/index.js', './src/plugins/contentModule/variableAnaly.js'],
    'content-script1.js': ['./src/plugins/contentModule/monitor.js', './src/plugins/contentModule/market.js'],
    'contentScript.js': './src/plugins/contentScript.js',
    'chaqz_web.js': './src/plugins/chaqz_web.js',
    'chaqz.js': './src/plugins/chaqz.js',

    // background-scripts
    'background.js': './src/plugins/background.js',

  },
  output: {
    // path: path.resolve(__dirname, 'js'),
    filename: './js/[name]'
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
     new CopyWebpackPlugin([
       {
         from:__dirname+'/src/assets',
         to:''
       }
     ]),
      new CleanWebpackPlugin(),
      // new webpack.ProvidePlugin({
      //   $: 'jquery',
      //   jQuery: 'jquery',
      //   'window.jQuery': 'jquery',
      //   'window.$': 'jquery'
      // })
   ]
};