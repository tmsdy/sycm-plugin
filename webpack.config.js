const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MangleJsClassPlugin = require('mangle-js-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
module.exports = {
  // devtool: 'inline-source-map',
  // mode:'production',
  entry: {
    // content-scripts
    'content_script.js': ['./src/plugins/sycmModule/index.js', './src/plugins/sycmModule/variableAnaly.js'],
    'content_script1.js': ['./src/plugins/sycmModule/monitor.js', './src/plugins/sycmModule/market.js'],
    'contentScript.js': './src/plugins/contentScript.js',
    'chaqz_web.js': './src/plugins/chaqz_web.js',
    'chaqz.js': './src/plugins/chaqzModule/chaqz.js',
    'interceptRquest.js': './src/utils/interceptRquest.js',

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
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "commons.js",
            chunks: "initial",
            minChunks: 2,
            minSize: 0
        }
      }
    }
  },
   plugins: [
     new UglifyJSPlugin(),
     new CopyWebpackPlugin([
       {
         from:__dirname+'/src/assets',
         to:''
       }
     ]),
      new CleanWebpackPlugin(),
       new webpack.DefinePlugin({
         'process.env.ASSET_PATH': JSON.stringify(process.env.NODE_ENV)
       }),
      // new webpack.ProvidePlugin({
      //   $: 'jquery',
      //   jQuery: 'jquery',
      //   'window.jQuery': 'jquery',
      //   'window.$': 'jquery'
      // })
   ]
};