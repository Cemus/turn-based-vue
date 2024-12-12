<template>
  <main>
    <div v-if="!isConnected">
      <h3>Chosissez un pseudo</h3>
      <input type="text" v-model="username" />
      <br />
      <button type="submit" @click.prevent="connectToServer()">Connect</button>
    </div>
    <div v-if="isConnected">
      <h2>
        Connecté en tant que <em>{{ currentPlayer?.name }}</em>
      </h2>
      <button v-if="!isReady" type="button" @click="toggleReady()">Appuyez pour commencer</button>
      <div v-if="isReady && !areBothReady">
        <p>En attente d'un joueur...</p>
        <button type="button" @click="toggleReady()">Cancel</button>
      </div>
    </div>
    <div v-if="gameState"></div>
    <div v-if="gameOver">
      <p>Jeu terminé! Gagnant: {{ winner }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
const gameStore = useGameStore()
const { gameState, isConnected, playerId, isReady, areBothReady } = storeToRefs(gameStore)

const username = ref('')
const gameOver = ref(false)
const winner = ref(null)
const currentPlayer = ref(gameStore.getCurrentPlayer)

const connectToServer = () => {
  if (username.value.length > 0) {
    if (!isConnected.value) {
      console.log('Tente de se connecter au serveur...')
      gameStore.connectWebSocket(username.value.toString())
    }
  }
}

const toggleReady = () => {
  if (playerId.value) {
    gameStore.toggleReady(playerId.value)
  }
}

watch(
  [gameState, playerId],
  () => {
    if (gameState.value && playerId.value) {
      currentPlayer.value = gameStore.getCurrentPlayer
    }
  },
  { immediate: true },
)
</script>

<style lang="css" scoped>
main {
  text-align: center;
}
</style>
