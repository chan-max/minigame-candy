import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import requireTransform from 'vite-plugin-require-transform'
import { qrcode } from 'vite-plugin-qrcode';
export default defineConfig({
    build: {
    },
    plugins: [
        vue({
        }),
        // 2. 添加以下代码
        requireTransform({
            fileRegex: /.ts$|.vue$/,
        }),
        qrcode()
    ],
    server: {
        host: '0.0.0.0'
    }
})