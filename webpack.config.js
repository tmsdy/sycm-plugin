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
    'sycmContent.js': ['./src/plugins/sycmModule/index.js', './src/plugins/sycmModule/variableAnaly.js'],
    'sycmContent1.js': './src/plugins/sycmModule/monitor.js',
    'sycmContent2.js':  './src/plugins/sycmModule/market.js',
    'contentScript.js': './src/plugins/sycmModule/contentScript.js',
    
    'chaqz_web.js': './src/plugins/chaqzModule/chaqz_web.js',
    'chaqzContent.js': './src/plugins/chaqzModule/chaqz.js',

    'chaqz_direct.js': './src/plugins/directTaobao/chaqz_direct.js',
    'tbDirect.js': './src/plugins/directTaobao/tbDirect.js',

    'chaqz_trade.js': './src/plugins/tbTrade/chaqz_trade.js',
    'tbTrade.js': './src/plugins/tbTrade/tbTrade.js',
    'popup.js': './src/plugins/sycmModule/popup.js',

    // 'interceptRquest.js': './src/utils/interceptRquest.js',
    // 'insertSha.js': './src/plugins/insertSha.js',

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
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['latest'] //按照最新的ES6语法规则去转换
        }
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
  devServer:{
    contentBase: './dist',
    open: true,
    port: 8080,
    hot: true,
    hotOnly: true
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "sycmCommons.js",
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