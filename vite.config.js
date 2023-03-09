import { defineConfig } from 'vite'
const { resolve } = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: resolve(__dirname, 'public'),
  assetsInclude: resolve(__dirname, 'src/assets'),
  resolve: {
    // 别名
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8081,
    proxy: {
      '/api': {
        target: '',
        changeOrigin: true, //是否跨域
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    sourcemap: false,
    emptyOutDir: true, // 构建时清空该目录
    rollupOptions: {
      input: 'src/lib/index.js',
      output:{
        entryFileNames: `webGis.min.js`,
        chunkFileNames: `[name].js`,
        // css文件名
        assetFileNames: `webGis.[ext]`
        // 比如你想构建出来的css为dist/index.css，那么你可以这样
        //  assetFileNames: `index.[ext]`
      },
    },
    minify: 'terser', // 必须启用：terserOptions配置才会有效
    terserOptions: {
      compress: {
        // 生产环境时移除console.log调试代码
        drop_console:true,
        drop_debugger: true,
      }
    }
  }
})
