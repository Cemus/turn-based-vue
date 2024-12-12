<template>
  <h2>Vous avez été déconnecté</h2>
  <br />
  <button type="button" @click="router.push('/')">Retourner au lobby</button>
</template>

<script setup>
import router from '@/router'
</script>

<style lang="css" scoped></style>
