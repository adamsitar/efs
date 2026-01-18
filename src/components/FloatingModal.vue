<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDraggable } from '@vueuse/core';
import { useModalsStore } from '@/stores/modals';

interface Props {
  modalKey: string;
}

const props = defineProps<Props>();

const modalsStore = useModalsStore();
const modal = computed(() => modalsStore.getModal(props.modalKey));

// Draggable window with title bar as handle
const el = ref<HTMLElement | null>(null);
const handle = ref<HTMLElement | null>(null);

const { x, y } = useDraggable(el, {
  initialValue: modal.value?.position ?? { x: 0, y: 0 },
  handle,
  preventDefault: true,
  onEnd: (position) => {
    modalsStore.updatePosition(props.modalKey, position);
  },
});

// Sync position from store (for restore from minimized)
watch(
  () => modal.value?.position,
  (newPos) => {
    if (newPos) {
      x.value = newPos.x;
      y.value = newPos.y;
    }
  },
  { deep: true }
);

// Bring to front on click
function handleClick() {
  modalsStore.bringToFront(props.modalKey);
}

function handleClose() {
  modalsStore.closeModal(props.modalKey);
}

function handleMinimize() {
  modalsStore.toggleMinimize(props.modalKey);
}

// Compute if modal should be visible
const isVisible = computed(() => {
  return modal.value && !modal.value.isMinimized;
});
</script>

<template>
  <div
    v-if="isVisible"
    ref="el"
    :style="{
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      width: `${modal?.size.width}px`,
      height: `${modal?.size.height}px`,
      zIndex: modal?.zIndex ?? 1000,
    }"
    class="bg-elevated border border-border-default shadow-lg flex flex-col outline-none rounded-xs overflow-hidden"
    @click="handleClick"
  >
    <!-- Title bar (draggable handle) -->
    <div
      ref="handle"
      class="flex items-center justify-between px-2 py-1 border-b border-border-default bg-panel cursor-move select-none min-h-7"
    >
      <div class="text-sm text-primary font-medium">
        {{ modal?.title }}
      </div>

      <div class="flex items-center gap-1">
        <!-- Minimize button -->
        <div
          class="i-ph-minus text-xs cursor-pointer text-primary hover:text-accent transition-colors"
          @click.stop="handleMinimize"
        />

        <!-- Close button -->
        <div
          class="i-ph-x text-xs cursor-pointer text-primary hover:text-accent transition-colors"
          @click.stop="handleClose"
        />
      </div>
    </div>

    <!-- Content area (dynamic component) -->
    <div class="flex-1 overflow-hidden p-2">
      <component :is="modal?.component" v-bind="modal?.props || {}" />
    </div>
  </div>
</template>
