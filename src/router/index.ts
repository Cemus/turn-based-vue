import { createRouter, createWebHistory } from 'vue-router'
import TheGame from '@/views/GameRoom.vue'
import GameContainer from '@/views/GameContainer.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GameContainer,
    },
    { path: '/game', name: 'game', component: TheGame },
  ],
})

export default router
