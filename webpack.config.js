const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const MangleJsClassPlugin = require('mangle-js-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');//打包css
const envStatus = process.env.NODE_ENV == 'production'?'prod':'dev';
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const releaseVersion = 'v1.0.19';
module.exports = {
  // devtool: 'inline-source-map',
  // mode:'production',
  entry: {
    // content-scripts
    'sycmContent': ['./src/plugins/sycmModule/index.js', './src/plugins/sycmModule/variableAnaly.js'],
    'sycmContent1': './src/plugins/sycmModule/monitor.js',
    'sycmContent2':  './src/plugins/sycmModule/market.js',
    'contentScript': './src/plugins/sycmModule/contentScript.js',
    
    'chaqz_web': './src/plugins/chaqzModule/chaqz_web.js',
    'chaqzContent': './src/plugins/chaqzModule/chaqz.js',

    'chaqz_direct': './src/plugins/directTaobao/chaqz_direct.js',
    'tbDirect': './src/plugins/directTaobao/tbDirect.js',

    'chaqz_trade': './src/plugins/tbTrade/chaqz_trade.js',
    'tbTrade': './src/plugins/tbTrade/tbTrade.js',
    'popup': './src/plugins/sycmModule/popup.js',

    // 'interceptRquest': './src/utils/interceptRquest.js',
    'tbSearchDetail': './src/plugins/taobao/tbSearchDetail.js',
    'chaqz-tbSearch': './src/plugins/taobao/chaqz-tbSearch.js',

    // background-scripts
    'background': './src/plugins/background.js',

  },
  output: {
    // path: path.resolve(__dirname, 'js'),
    // filename: './js/[name]-' + envStatus + releaseVersion +'.js'
    filename: './js/[name].js'
  },
   resolve: {
     alias: {
       image: path.resolve(__dirname, 'src/common/images/')
     }
   },
  module: {
    rules: [
      {
        test: /\.css$/,
         use: ExtractTextWebpackPlugin.extract({
           // 将css用link的方式引入就不再需要style-loader了
           use: 'css-loader'
         }),
        // use: [
        //   {
        //     loader: 'style-loader'
        //   },
        //   {
        //     loader: 'css-loader'
        //   },
        //   {
        //     loader: 'postcss-loader'
        //   }
        // ],
        include:path.resolve(__dirname,'src'),
        exclude:/node_modules/
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
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
            outputPath: 'images/' // 图片打包后存放的目录
          }
        }]
      }
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
    minimize: envStatus=='prod'?true:false,
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "sycmCommons",
          chunks: "initial",
          minChunks: 2,
          minSize: 0,
          // test: /src\/common\/(.*)\.js/
        }
      }
    }
  },
   plugins: [
     new UglifyJSPlugin({
       uglifyOptions: {
         compress: {
           warnings: false,
           drop_debugger: false,
           drop_console: true
         }
       }
     }),
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
       new ExtractTextWebpackPlugin('css/style.css'),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g, //一个正则表达式，指示应优化/最小化的资产的名称。提供的正则表达式针对配置中ExtractTextPlugin实例导出的文件的文件名运行，而不是源CSS文件的文件名。默认为/\.css$/g
            cssProcessor: require('cssnano'), //用于优化\最小化CSS的CSS处理器，默认为cssnano
            cssProcessorOptions: {
              safe: true,
              discardComments: {
                removeAll: true
              }
            }, //传递给cssProcessor的选项，默认为{}
            canPrint: true //一个布尔值，指示插件是否可以将消息打印到控制台，默认为true
          }),
      // new webpack.ProvidePlugin({
      //   $: 'jquery',
      //   jQuery: 'jquery',
      //   'window.jQuery': 'jquery',
      //   'window.$': 'jquery'
      // })
   ]
};