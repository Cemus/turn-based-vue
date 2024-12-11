<template>
  <WaitingRoom v-if="!areBothReady" />
  <TheGame v-if="areBothReady" />
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import WaitingRoom from './WaitingRoom.vue'
import TheGame from './GameRoom.vue'

const gameStore = useGameStore()
const { areBothReady } = storeToRefs(gameStore)
</script>

<style lang="css" scoped>
main {
  text-align: center;
}
</style>
