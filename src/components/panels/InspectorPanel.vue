<script setup lang="ts">
import Panel from '@/components/Panel.vue';
import { useLayoutStore } from '@/stores/layout';

interface Props {
  title: string;
  panelId: string;
}

const props = defineProps<Props>();

const layoutStore = useLayoutStore();

function handleClose() {
  layoutStore.closePanel(props.panelId);
}
</script>

<template>
  <Panel :title="title" :panel-id="panelId" @close="handleClose">
    <vstack gap="2">
      <h1 class="text-2xl font-bold text-primary mb-4">Inspector Panel</h1>
      <p class="text-secondary leading-relaxed">Details, settings, properties</p>
      <p class="text-muted text-sm">Placeholder for future inspector content</p>
    </vstack>
  </Panel>
</template>
