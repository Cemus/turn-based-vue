<template>
  <main>
    <div v-if="isConnected">
      <h2>Connecté en tant que joueur {{ playerId }}</h2>
      <button v-if="!isReady" type="button" @click="setReady">Appuyez pour commencer</button>
      <p v-if="isReady && !areBothReady">En attente d'un joueur...</p>
    </div>
    <h2 v-else>Connexion en attente...</h2>
    <div v-if="gameState"></div>
    <div v-if="gameOver">
      <p>Jeu terminé! Gagnant: {{ winner }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
const { socket, gameState, isConnected, playerId, connectWebSocket } = useGameStore()

const isReady = ref(false)
const gameOver = ref(false)
const winner = ref(null)
const areBothReady = ref(false)

const connectToServer = () => {
  if (!isConnected) {
    console.log('Tentative de connexion WebSocket...')
    connectWebSocket()
  }
}

const setReady = () => {
  if (!socket || !playerId) {
    console.log('Pas de socket ou playerId non défini')
    return
  }

  const message = {
    type: 'ready',
    action: !isReady.value,
    playerId: playerId,
  }
  socket.send(JSON.stringify(message))
  console.log('Message "ready" envoyé au serveur')
}

onMounted(() => {
  connectToServer()
})

// Check changements
watch(
  () => isConnected,
  (newValue) => {
    if (newValue) {
      console.log('WebSocket connecté !')
    } else {
      console.log('Connexion WebSocket perdue.')
    }
  },
)
</script>

<style lang="css" scoped>
main {
  text-align: center;
}
</style>
