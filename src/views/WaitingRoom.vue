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
import { ref, onMounted, watch, watchEffect } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { socket, gameState, isConnected, playerId } = storeToRefs(gameStore)
const isReady = ref(false)
const gameOver = ref(false)
const winner = ref(null)
const areBothReady = ref(false)

const connectToServer = () => {
  if (!isConnected.value) {
    console.log('Tente de se connecter au serveur...')
    gameStore.connectWebSocket()
  }
}

const setReady = () => {
  const sckt = socket.value
  const id = playerId.value
  if (!sckt || !id) {
    console.log('Pas de socket ou playerId non défini')
    return
  }
  const message = {
    type: 'ready',
    action: !isReady.value,
    playerId: id,
  }
  sckt?.send(JSON.stringify(message))
}

onMounted(() => {
  connectToServer()
})

// Check changements
watch(
  () => isConnected.value,
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
