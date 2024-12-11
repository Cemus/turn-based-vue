<template>
  <main>
    <h2>Jeu en cours</h2>
    <div v-if="gameState">
      <p>
        Vous êtes le joueur {{ currentPlayer?.id }},
        {{ currentPlayer?.turn ? `C'est votre tour` : `Ce n'est point votre tour` }}
      </p>
      <p>Vos HP: {{ currentPlayer?.hp }}</p>
      <p>Tour actuel: {{ gameState.turn }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
const gameStore = useGameStore()
const { gameState } = storeToRefs(gameStore)
const currentPlayer = gameStore.getCurrentPlayer
</script>
