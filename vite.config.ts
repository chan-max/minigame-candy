import { defineConfig } from 'vite'
import requireTransform from 'vite-plugin-require-transform' // 1. 引入插件
import { qrcode } from 'vite-plugin-qrcode';
export default defineConfig({
    build: {
    },
    plugins: [
        // 2. 添加以下代码
        requireTransform({
            fileRegex: /.ts$|.vue$/,
        }),
        qrcode()
    ],
    server:{
        host:'0.0.0.0'
    }
})