/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const Config = require('webpack-chain')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')


function resolve (dir) {
  return path.join(__dirname, dir)
}

const PACKAGE_NAME = 'Instance'
const IS_PROD = process.env.NODE_ENV === 'production'
const OUTPUT_DIR = IS_PROD ? resolve('dist') : resolve('dev')
const DEVTOOL = IS_PROD ? false : 'source-map'
const NODE_MODULES_PATH = resolve('node_modules')

const config = new Config()

// ----------------------------------
// 模式与输入输出
// ----------------------------------
config
  .mode(process.env.NODE_ENV)
  .entry('index')
    .add(resolve('src'))
    .end()
  .output
    .path(OUTPUT_DIR)
    .filename('[name].bundle.js')
    .library(PACKAGE_NAME)
    .libraryTarget('umd')
    

// ----------------------------------
// 开发模式监听文件目录
// ----------------------------------
config.watch(!IS_PROD)

// ----------------------------------
// 解析规则、别名
// 别名需要在 jsconfig.json 中添加才能被 vscode 解析
// ----------------------------------
config.resolve
  .extensions
    .add('.js')
    .end()
  .alias
    .set('@', resolve('src'))

// ----------------------------------
// 配置 loader
// ----------------------------------
// 编译 Javscript
config.module
  .rule('compile-js')
    .test(/\.js$/)
    .exclude
      .add(NODE_MODULES_PATH)
      .end()
    .use('babel')
      .loader('babel-loader')

// 编译 Typescript
// Typescript 下需要安装 typescript 与 ts-loader，并且需要在 babelrc 中引入 @babel/preset-typescript
config.module
  .rule('compile-ts')
    .test(/\.ts$/)
    .exclude
      .add(NODE_MODULES_PATH)
      .end()
    .use('babel')
      .loader('babel-loader')
      .end()
    .use('typescript')
      .loader('ts-loader')

// 处理静态资源
// config.module
//   .rule('static-file')
//     .test(/\.(png|svg|jpg|gif)$/)
//     .exclude
//       .add(NODE_MODULES_PATH)
//       .end()
//     .use('file')
//       .loader('file-loader')

// 处理 CSS
// 需要额外安装 mini-css-extract-plugin，因为在生产环境下 style-loader 无法兼容 HMR
// config.module
//   .rule('style-css')
//     .test(/\.css$/)
//     .use('style-loader')
//       .loader(IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader')
//       .end()
//     .use('css-loader')
//       .loader('css-loader')

// 处理 SCSS
// 需要额外安装 mini-css-extract-plugin，因为在生产环境下 style-loader 无法兼容 HMR
// 需要额外安装 sass-loader 与 node-sass
// config.module
//   .rule('scss')
//     .test(/\.scss$/)
//     .use('style-loader')
//       .loader(IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader')
//       .end()
//     .use('css-loader')
//       .loader('css-loader')
//       .end()
//     .use('sass-loader')
//       .loader('sass-loader')

// ----------------------------------
// 插件配置
// ----------------------------------
// 构建前清理
config
  .plugin('clean')
  .use(CleanWebpackPlugin, [
    {
      path: OUTPUT_DIR
    }
  ])

// HTML 模版（可自动生成）
// 需要引入 html-webpack-plugin
// if (!IS_PROD) {
//   config
//     .plugin('html')
//     .use(HtmlWebpackPlugin, [
//       {
//         template: path.join(__dirname, 'examples', 'index.html'),
//         inject: true
//       }
//     ])
// }

// 热重载
if (!IS_PROD) {
  config
    .plugin('hmr')
    .use(webpack.HotModuleReplacementPlugin)
}

// ----------------------------------
// 开发模式生成 source-map
// ----------------------------------
config.devtool(DEVTOOL)

// ----------------------------------
// 需要修改默认 minimizer 时使用，比如保留代码中的注释
// 需要安装 terser-webpack-plugin
// ----------------------------------
config.optimization
  .minimizer('terser')
  .use(TerserPlugin, [
    {
      terserOptions: {
        compress: true,
        output: {
          comments: true
        }
      },
      extractComments: true
    }
  ])

// ----------------------------------
// 生产环境下压缩 CSS
// 需要安装 css-minimizer-webpack-plugin
// ----------------------------------
// if (IS_PROD) {
//   config.optimization
//     .minimizer('css-uglify')
//     .use(CssMinimizerPlugin)
// }

// ----------------------------------
// Nodejs 模式，打包结果不会涉及 window
// ----------------------------------
// config.target('node')

// ----------------------------------
// 开发服务器
// ----------------------------------
if (!IS_PROD) {
  config.devServer
    .open(true)
    .hot(true)
    .publicPath('/')
    .contentBase(OUTPUT_DIR)
    .host('0.0.0.0')
    .port(10010)
    .overlay(false)     // 出错时是否全屏覆盖显示
    .writeToDisk(false) // 是否生成打包结果到磁盘
    .compress(true)
}

module.exports = config.toConfig()
