<script setup lang="ts">
import { computed } from 'vue';
import FlightStrip from '@/components/FlightStrip.vue';
import DraggableWrapper from '@/components/DraggableWrapper.vue';
import DropZoneWrapper from '@/components/DropZoneWrapper.vue';
import { useStripsStore } from '@/stores/strips';
import { useServerConnection } from '@/composables/useServerConnection';
import type { DragData } from '@/composables/useDragState';
import type { ClientMessage } from '@/types/ws-messages';

interface Props {
  panelKey: string;
}

defineProps<Props>();

const stripsStore = useStripsStore();
const { send } = useServerConnection();

const flightStrips = computed(() => {
  // Sort by last_modified in descending order (most recent first)
  return [...stripsStore.arrived].sort((a, b) => b.last_modified - a.last_modified);
});

const handleStripDrop = (dragData: DragData) => {
  if (dragData.sourceArray === 'Arrived') {
    return;
  }

  const message: ClientMessage = {
    type: 'MoveStrip',
    strip_id: dragData.stripId,
    from: dragData.sourceArray,
    to: 'Arrived',
  };

  send(JSON.stringify(message));
};
</script>

<template>
  <DropZoneWrapper target-array="Arrived" :on-drop="handleStripDrop" :accepts="['strip']">
    <vstack gap="1" class="h-full">
      <DraggableWrapper
        v-for="strip in flightStrips"
        :key="strip.id"
        :data="{ type: 'strip', stripId: strip.id, sourceArray: 'Arrived' }"
      >
        <FlightStrip
          :strip-id="`${panelKey}-strip-${strip.id}`"
          :strip="strip"
          current-array="Arrived"
        />
      </DraggableWrapper>
    </vstack>
  </DropZoneWrapper>
</template>
