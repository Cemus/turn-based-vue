import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type GameState } from '@/types'

export const useGameStore = defineStore('gameStore', () => {
  const socketUrl: string = 'http://localhost:3000/'
  const socket = ref<WebSocket | null>(null)
  const gameState = ref<GameState | null>(null)

  const connectWebSocket = () => {
    socket.value = new WebSocket(socketUrl)
    socket.value.onopen = () => {
      console.log('WebSocket connecté')
    }
    socket.value.onerror = (error) => {
      console.error('Erreur WebSocket :', error)
    }
    socket.value.onclose = () => {
      console.log('Déconnecté du WebSocket')
    }
  }

  return {
    socket,
    connectWebSocket,
    gameState,
  }
})
