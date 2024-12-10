<template>
  <div>
    <h2>Jeu en cours</h2>
    <div v-if="gameState">
      <p>Joueur: {{ gameState.player }}</p>
      <p>Tour actuel: {{ gameState.turn }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { computed } from 'vue'
const gameStore = useGameStore()

const gameState = computed(() => gameStore.gameState)
</script>
