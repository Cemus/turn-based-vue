<template>
  <main>
    <div v-if="isConnected">
      <h2>Connecté en tant que joueur {{ playerId }}</h2>
      <button type="button" @click="startGame">Appuyez pour commencer</button>
    </div>
    <h2 v-else>Connexion en attente...</h2>
    <div v-if="isConnected">
      <p>{{ gameState }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
const isConnected = ref(false)
const playerId = ref(null)
const gameState = ref(null)
const gameOver = ref(false)
const winner = ref(null)
const connectToServer = () => {
  const socket = new WebSocket('https://airy-shelled-llama.glitch.me/')
  if (!socket) {
    return
  }
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'connected') {
      playerId.value = data.playerId
      isConnected.value = true
      console.log('Connecté au serveur WebSocket en tant que joueur', playerId)
    } else if (data.type === 'update') {
      gameState.value = data.gameState
      console.log(gameState)
    } else if (data.type === 'gameOver') {
      gameOver.value = true
      winner.value = data.winner
    }
  }

  socket.onerror = (error) => {
    console.error('Erreur WebSocket :', error)
  }

  socket.onclose = () => {
    console.log('Déconnecté du serveur WebSocket.')
  }
}

const startGame = () => {
  const socket = new WebSocket('https://airy-shelled-llama.glitch.me/')
  if (!socket) {
    return
  }
  console.log(socket)
  console.log(socket)
  if (socket && playerId.value) {
    const message = {
      type: 'action',
      action: 'attack',
    }

    socket.send(JSON.stringify(message))
  }
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
