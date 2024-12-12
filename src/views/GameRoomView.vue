<template>
  <main>
    <h2>Jeu en cours</h2>
    <div v-if="gameState && currentPlayer">
      <p>
        Vous êtes {{ currentPlayer.name }}, C'est au tour de
        {{ gameState.players[gameState.turn].name }}
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

const gameStore = useGameStore()
const { gameState } = storeToRefs(gameStore)
const currentPlayer = gameStore.getCurrentPlayer

const attack = () => {
  console.log(currentPlayer)
  if (currentPlayer) {
    console.log(currentPlayer.id)
    gameStore.attack(currentPlayer.id)
  }
}
</script>
