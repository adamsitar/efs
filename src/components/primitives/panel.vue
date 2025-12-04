<script setup lang="ts">
defineProps<{
  padding?: 'sm' | 'md' | 'lg';
  scrollable?: boolean;
}>();
</script>

<template>
  <div
    class="h-full bg-panel"
    :class="[
      padding === 'sm' ? 'p-1' : padding === 'lg' ? 'p-4' : 'p-2',
      scrollable ? 'overflow-auto' : '',
    ]"
  >
    <slot />
  </div>
</template>
