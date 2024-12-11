import { defineStore } from 'pinia'
import { type GameState } from '@/types'

interface State {
  socketUrl: URL
  socket: WebSocket | null
  gameState: GameState | null
  playerId: Number | null
  isConnected: Boolean
  isReady: Boolean
  areBothReady: Boolean
}

export const useGameStore = defineStore('gameStore', {
  state: (): State => {
    return {
      socketUrl: new URL('ws://localhost:3000/'),
      socket: null,
      gameState: null,
      playerId: null,
      isConnected: false,
      isReady: false,
      areBothReady: false,
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
        switch (data.type) {
          case 'connected':
            this.playerId = data.playerId
            break
          case 'toggleReady':
            this.isReady = data.value
            break
          case 'toggleReady':
            this.isReady = data.value
            break
          case 'setBothReady':
            this.areBothReady = data.value
            this.gameState = data.gameState
            console.log(this.gameState)
            break
        }
      }
    },
    toggleReady(playerId: Number) {
      if (!this.socket || !playerId) {
        console.log('Pas de socket ou playerId non défini')
        return
      }
      const message = {
        type: 'ready',
        action: !this.isReady,
        playerId: playerId,
      }
      this.socket?.send(JSON.stringify(message))
    },
  },
  getters: {
    getCurrentPlayer(state) {
      return state.gameState?.players.find((player) => player.id === state.playerId) || null
    },
  },
})
