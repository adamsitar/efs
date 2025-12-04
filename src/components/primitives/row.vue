<script setup lang="ts">
defineProps<{
  gap?: '1' | '2' | '3' | '4' | '6' | '8';
  align?: 'start' | 'center' | 'end';
}>();
</script>

<template>
  <div
    class="flex"
    :class="[`gap-${gap ?? '2'}`, align ? `items-${align}` : 'items-center']"
  >
    <slot />
  </div>
</template>
