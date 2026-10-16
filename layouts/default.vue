<template>
  <div class="layout">
    <AppHeader />
    <main class="page-main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useReveal } from '~/composables/useReveal'

useReveal()
</script>

<style scoped>
.layout {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
}
.page-main {
  flex: 1;
}
</style>