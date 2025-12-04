<script setup lang="ts">
defineProps<{
  gap?: '1' | '2' | '3' | '4' | '6' | '8';
}>();
</script>

<template>
  <div class="flex flex-col" :class="`gap-${gap ?? '4'}`">
    <slot />
  </div>
</template>
