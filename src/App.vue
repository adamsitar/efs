<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'

const layoutStore = useLayoutStore()
</script>

<template>
  <div class="h-screen w-screen bg-base">
    <splitter :node="layoutStore.root" :is-root="true" />
  </div>
</template>
