<template>
  <main>
    <div v-if="isConnected">
      <h2>Connecté en tant que joueur {{ playerId }}</h2>
      <button v-if="!isReady" type="button" @click="setReady">Appuyez pour commencer</button>
      <p v-if="isReady && !areBothReady">En attente d'un joueur...</p>
    </div>
    <h2 v-else>Connexion en attente...</h2>
    <div v-if="isConnected && gameState"></div>
    <div v-if="gameOver">
      <p>Jeu terminé! Gagnant: {{ winner }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import router from '@/router'
import { useGameStore } from '@/stores/gameStore'
import { onMounted, ref, watch } from 'vue'

const isConnected = ref(false)
const isReady = ref(false)
const playerId = ref(null)
const gameOver = ref(false)
const winner = ref(null)
const areBothReady = ref(false)
const isSocketReady = ref(false)

const { socket, gameState } = useGameStore()
console.log(socket)
const connectToServer = () => {
  console.log('Tentative de connexion WebSocket...')

  if (socket) {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'connected') {
        playerId.value = data.playerId
        isConnected.value = true
        isSocketReady.value = true
        console.log('Connecté au serveur WebSocket en tant que joueur', playerId.value)
      } else if (data.type === 'update') {
        /*         gameState.value = data.gameState
        console.log(gameState.value) */
      } else if (data.type === 'gameOver') {
        gameOver.value = true
        winner.value = data.winner
      } else if (data.type === 'setReady') {
        isReady.value = data.value
      } else if (data.type === 'bothReady') {
        router.push({ path: '/game' })
      }
    }

    socket.onerror = (error) => {
      console.error('Erreur WebSocket :', error)
    }

    socket.onclose = () => {
      console.log('Déconnecté du serveur WebSocket.')
      isConnected.value = false
      isSocketReady.value = false
    }
  }
}

const setReady = () => {
  if (!socket || !isSocketReady.value || !playerId.value) {
    console.log('Pas de socket prêt ou playerId non définis')
    return
  }

  const message = {
    type: 'ready',
    action: !isReady.value,
    playerId: playerId.value,
  }
  console.log(message)

  socket.send(JSON.stringify(message))
  console.log('Message "ready" envoyé au serveur')
}

onMounted(() => {
  connectToServer()
})
</script>

<style lang="css" scoped>
main {
  text-align: center;
}
</style>
