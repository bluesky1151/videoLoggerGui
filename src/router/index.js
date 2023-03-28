import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import mainPage from '../views/mainPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: "/u",
    name: "main",
    component: mainPage
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
