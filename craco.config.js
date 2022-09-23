const path = require('path')
const pxToViewport = require('postcss-px-to-viewport')

module.exports = {
  
  // webpack 配置
  webpack: {
  
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src'),
      '@scss': path.resolve(__dirname, 'src', 'assets', 'styles')
    },
  },
  // 配置 px-to-viewport 插件 --- 自动将 px转换为vw
  style: {
    postcss: {
      // viewportWith 基准尺寸 -- 375px，需要设置为设计稿上的实际高度
      plugins: [pxToViewport({viewportWidth: 375})]
    }
  }
}