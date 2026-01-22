<script setup lang="ts">
import { useDraggable } from '@vueuse/core';
import { ref } from 'vue';
import { useDragState, type DragData } from '@/composables/useDragState';

interface Props {
  data: DragData;
}

const props = defineProps<Props>();

const el = ref<HTMLElement | null>(null);
const { setDragData, clearDragData } = useDragState();

useDraggable(el, {
  onStart: () => {
    setDragData(props.data);
  },
  onEnd: () => {
    clearDragData();
  },
});
</script>

<template>
  <div ref="el" draggable="true">
    <slot />
  </div>
</template>
