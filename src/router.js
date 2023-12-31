import { createRouter, createWebHistory } from 'vue-router'
import GachaListVue from './GachaList.vue'
import HomeVue from './Home.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeVue },
  { path: '/gacha', name: 'Gacha', component: GachaListVue },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
