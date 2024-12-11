import { defineStore } from 'pinia'
import { type GameState } from '@/types'

interface State {
  socketUrl: URL
  socket: WebSocket | null
  gameState: GameState | null
  isConnected: Boolean
  playerId: Number | null
}

export const useGameStore = defineStore('gameStore', {
  state: (): State => {
    return {
      socketUrl: new URL('ws://localhost:3000/'),
      socket: null,
      gameState: null,
      isConnected: false,
      playerId: null,
    }
  },
  actions: {
    connectWebSocket() {
      if (this.socket) {
        this.socket.close()
      }

      this.socket = new WebSocket(this.socketUrl)

      this.socket.onopen = () => {
        console.log('Webthis.socket connecté')
        this.isConnected = true
      }

      this.socket.onerror = (error: unknown) => {
        console.error('Erreur Webthis.socket :', error)
        this.isConnected = false
      }

      this.socket.onclose = () => {
        console.log('Déconnecté du Webthis.socket')
        this.isConnected = false
      }

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'connected') {
          this.playerId = data.playerId
        }
      }
    },
  },
})
