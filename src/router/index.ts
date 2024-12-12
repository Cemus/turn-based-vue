import { createRouter, createWebHistory } from 'vue-router'
import TheGame from '@/views/GameRoomView.vue'
import GameContainer from '@/views/GameContainerView.vue'
import DisconnectedView from '@/views/DisconnectedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: GameContainer,
    },
    { path: '/game', name: 'Game', component: TheGame },
    { path: '/disconnected', name: 'Disconnected', component: DisconnectedView },
  ],
})

export default router
