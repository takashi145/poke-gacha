import './assets/style.css'

import { createApp } from 'vue'
import App from './App.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import router from './router'

createApp(App).use(VueQueryPlugin).use(router).mount('#app')
