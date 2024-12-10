<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/shared/TheHeader.vue'
import TheFooter from './components/shared/TheFooter.vue'
</script>

<template>
  <TheHeader />
  <RouterView />
  <TheFooter />
</template>

<style scoped></style>
