<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDragState, type DragData } from '@/composables/useDragState';
import type { StripArray } from '@/types/ws-messages';

interface Props {
  targetArray: StripArray;
  onDrop: (dragData: DragData) => void;
  accepts?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  accepts: () => ['strip'],
});

const { currentDrag } = useDragState();
const isHovering = ref(false);

const canAcceptDrop = computed(() => {
  if (!currentDrag.value) return false;
  return props.accepts.includes(currentDrag.value.type);
});

const handleDragOver = (event: DragEvent) => {
  if (canAcceptDrop.value) {
    event.preventDefault();
    isHovering.value = true;
  }
};

const handleDragLeave = () => {
  isHovering.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isHovering.value = false;

  if (currentDrag.value && canAcceptDrop.value) {
    props.onDrop(currentDrag.value);
  }
};
</script>

<template>
  <div
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    :class="[
      'transition-all h-full min-h-full',
      isHovering && canAcceptDrop ? 'ring-2 ring-blue-500 bg-blue-500/10' : '',
    ]"
  >
    <slot />
  </div>
</template>
