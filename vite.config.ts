import { defineConfig } from 'vite'
import requireTransform from 'vite-plugin-require-transform' // 1. 引入插件

export default defineConfig({
    build: {
        rollupOptions: {
            input: 'index.js',
            output: {
                name:'candy',
                dir: 'bundle',   // 输出目录
                format: 'iife',  // 立即调用函数模式
                entryFileNames: 'index.js' // 输出文件名
            }
        }
    },
    plugins: [
        // 2. 添加以下代码
        requireTransform({
            fileRegex: /.ts$|.vue$/,
        }),
    ],
})