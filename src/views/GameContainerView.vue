<template>
  <WaitingRoomView v-if="!areBothReady" />
  <TheGameView v-if="areBothReady" />
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'
import WaitingRoomView from './WaitingRoomView.vue'
import TheGameView from './GameRoomView.vue'

const gameStore = useGameStore()
const { areBothReady } = storeToRefs(gameStore)
</script>

<style lang="css" scoped>
main {
  text-align: center;
}
</style>
