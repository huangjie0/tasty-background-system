const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
  transpileDependencies: true,
  lintOnSave: false, //关闭eslint检查
  devServer: {
    proxy: {
      '/api': {
        target: 'http://49.235.98.65:8889',
        ws: true,
        changeOrigin: true,
        pathRewrite:{
          '^/api':'/'
        }
      }
    }
  }
})
