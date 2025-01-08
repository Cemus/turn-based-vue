<template>
  <main>
    <h2>Jeu en cours</h2>
    <div v-if="gameState && currentPlayer">
      <p>
        Vous êtes {{ currentPlayer.name }},
        {{
          isMyTurn()
            ? `C'est à votre tour !`
            : `C'est au tour de
         ${getPlayerWhoseTurnItIs()}...`
        }}
      </p>
      <p v-for="player in gameState.players">{{ player.name }} HP : {{ player.stats.hp }}</p>
    </div>
    <button v-if="isMyTurn() && gameState?.winner === -1" type="button" @click="attack()">
      Attack
    </button>
    <h2>Log</h2>
    <p v-if="gameState?.winner === -1" v-for="message in log">{{ message }}</p>
    <div v-else>
      <p>Le duel est terminé !</p>
      <p>Vainqueur : {{ gameState?.players[gameState.winner].name }}</p>
      <p>{{ `Tu as ${gameState?.winner === currentPlayer?.id ? 'gagné !' : 'perdu...'}` }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'

const gameStore = useGameStore()
let { gameState, log } = storeToRefs(gameStore)
let currentPlayer = gameStore.getCurrentPlayer

const getPlayerWhoseTurnItIs = () => {
  if (gameState.value && gameState.value.players) {
    const player = gameState.value.players.find((player) => player.id === gameState.value?.turn)
    return player ? player.name : 'Inconnu'
  }
  return 'Inconnu'
}

const isMyTurn = () => {
  return getPlayerWhoseTurnItIs() === currentPlayer?.name
}
const attack = () => {
  if (currentPlayer) {
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
