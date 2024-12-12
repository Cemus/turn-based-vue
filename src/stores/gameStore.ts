import { defineStore } from 'pinia'
import { type GameState } from '@/types'
import router from '@/router'

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
    connectWebSocket(username: string) {
      if (this.socket) {
        this.socket.close()
      }

      this.socket = new WebSocket(this.socketUrl)

      this.socket.onopen = () => {
        const message = {
          type: 'setName',
          action: username,
        }

        this.socket?.send(JSON.stringify(message))
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
            this.gameState = data.gameState
            this.playerId = data.playerId
            this.isConnected = true
            break
          case 'toggleReady':
            this.isReady = data.value
            break
          case 'setBothReady':
            this.areBothReady = data.value
            this.gameState = data.gameState
            console.log(this.gameState)
            break
          case 'playerDisconnected':
            this.reset()
            router.push('./disconnected')
            this.socket?.close()
            break
        }
      }
    },

    reset() {
      this.socket = null
      this.gameState = null
      this.playerId = null
      this.isConnected = false
      this.isReady = false
      this.areBothReady = false
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

    attack(playerId: number) {
      if (!this.socket || !playerId) {
        console.log('Pas de socket ou playerId non défini')
        return
      }
      const message = {
        type: 'action',
        action: 'attack',
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
