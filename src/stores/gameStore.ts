import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type GameState } from '@/types'

export const useGameStore = defineStore('gameStore', () => {
  const socketUrl: string = 'ws://localhost:3000/'
  const socket = ref<WebSocket | null>(null)
  const gameState = ref<GameState | null>(null)
  const isConnected = ref<boolean>(false)
  const playerId = ref<string | null>(null)

  const connectWebSocket = () => {
    if (socket.value) {
      socket.value.close()
    }

    socket.value = new WebSocket(socketUrl)

    socket.value.onopen = () => {
      console.log('WebSocket connecté')
      isConnected.value = true
    }

    socket.value.onerror = (error) => {
      console.error('Erreur WebSocket :', error)
      isConnected.value = false
    }

    socket.value.onclose = () => {
      console.log('Déconnecté du WebSocket')
      isConnected.value = false
    }

    socket.value.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'connected') {
        playerId.value = data.playerId
      }
    }
  }

  return {
    socket,
    gameState,
    isConnected,
    playerId,
    connectWebSocket,
  }
})
