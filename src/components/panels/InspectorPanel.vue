<script setup lang="ts">
import { computed } from 'vue';
import Panel from '@/components/Panel.vue';
import { useFocusStore } from '@/stores/focus';
// @ts-expect-error - lowercase component
import col from '@/components/primitives/col.vue';

interface Props {
  title: string;
  panelId: string;
}

const props = defineProps<Props>();

// Check if this panel is focused
const focusStore = useFocusStore();
const isFocused = computed(() => focusStore.isFocused(props.panelId));

function handleClose() {
  console.log('Close panel:', props.title);
}
</script>

<template>
  <Panel :title="title" :focused="isFocused" @close="handleClose">
    <col gap="4" class="p-4">
      <h1 class="text-2xl font-bold text-primary mb-4">Inspector Panel</h1>
      <p class="text-secondary leading-relaxed">Details, settings, properties</p>
      <p class="text-muted text-sm">Placeholder for future inspector content</p>
    </col>
  </Panel>
</template>
