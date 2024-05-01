import * as  THREE from 'three'
import { createGame } from './src/index'
import VConsole from 'vconsole'
import { createApp } from 'vue'
import app from './src/view/app.vue'

new VConsole({
  mode: 'dark' as any
})

createApp(app).mount('#app')


