<template>
  <main>
    <h2>Jeu en cours</h2>
    <div v-if="gameState && currentPlayer">
      <p>
        Vous êtes {{ currentPlayer.name }},
        {{
          currentPlayer.name === getPlayerWhoseTurnItIs()
            ? `C'est à votre tour !`
            : `C'est au tour de
         ${getPlayerWhoseTurnItIs()}...`
        }}
      </p>
      <p>Vos HP: {{ currentPlayer?.stats.hp }}</p>
      <p>Tour actuel: {{ gameState.turn }}</p>
    </div>
    <button v-if="currentPlayer" type="button" @click="attack()">Attack</button>
  </main>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const gameStore = useGameStore()
let { gameState } = storeToRefs(gameStore)
let currentPlayer = gameStore.getCurrentPlayer

console.log(currentPlayer?.name)
console.log('curr pla', currentPlayer)

console.log(gameState.value)
console.log(gameState.value?.players[gameState.value?.turn].name)

const getPlayerWhoseTurnItIs = () => {
  if (gameState.value && gameState.value.players) {
    const player = gameState.value.players.find((player) => player.id === gameState.value?.turn)
    return player ? player.name : 'Inconnu'
  }
  return 'Inconnu'
}
const attack = () => {
  console.log(currentPlayer)
  if (currentPlayer) {
    console.log(currentPlayer.id)
    gameStore.attack(currentPlayer.id)
  }

  //Ici
  watch(
    [gameState],
    () => {
      if (gameState) {
        currentPlayer = gameStore.getCurrentPlayer
      }
    },
    { immediate: true },
  )
}
</script>
