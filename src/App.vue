<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout';
import { useModalsStore } from '@/stores/modals';
import { useWebSocket } from '@/composables/useWebSocket';
import StatusBar from '@/components/StatusBar.vue';
import FloatingModal from '@/components/FloatingModal.vue';

const layoutStore = useLayoutStore();
const modalsStore = useModalsStore();
useWebSocket();
</script>

<template>
  <div class="h-screen w-screen bg-base flex flex-col">
    <div class="flex-1 p-2 overflow-hidden">
      <splitter :node="layoutStore.root" />
    </div>
    <StatusBar />

    <FloatingModal v-for="modal in modalsStore.modals" :key="modal.key" :modal-key="modal.key" />
  </div>
</template>
