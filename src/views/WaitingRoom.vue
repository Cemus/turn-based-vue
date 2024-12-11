<template>
  <main>
    <div v-if="isConnected">
      <h2>Connecté en tant que joueur {{ playerId }}</h2>
      <button v-if="!isReady" type="button" @click="toggleReady()">Appuyez pour commencer</button>
      <div v-if="isReady && !areBothReady">
        <p>En attente d'un joueur...</p>
        <button type="button" @click="toggleReady()">Cancel</button>
      </div>
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
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { gameState, isConnected, playerId, isReady, areBothReady } = storeToRefs(gameStore)
const gameOver = ref(false)
const winner = ref(null)

onMounted(() => {
  connectToServer()
})

const connectToServer = () => {
  if (!isConnected.value) {
    console.log('Tente de se connecter au serveur...')
    gameStore.connectWebSocket()
  }
}

const toggleReady = () => {
  if (playerId.value) {
    gameStore.toggleReady(playerId.value)
  }
}

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
