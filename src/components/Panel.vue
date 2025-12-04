<script setup lang="ts">
interface Props {
  title: string;
  closable?: boolean;
  focused?: boolean;
}

withDefaults(defineProps<Props>(), {
  closable: true,
  focused: false,
});

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <div class="h-full flex flex-col border border-border-default bg-panel" :class="focused && 'focus-indicator'">
    <!-- Heading bar -->
    <div class="flex items-center justify-between px-2 py-1 border-b border-default min-h-7">
      <div class="text-sm text-primary">
        {{ title }}
      </div>
      <div v-if="closable" class="i-ph-x cursor-pointer text-primary hover:text-accent transition-colors"
        @click="emit('close')" />
    </div>

    <!-- Content area -->
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>
