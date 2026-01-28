<script setup lang="ts">
import { computed } from 'vue';
import Panel from '@/components/Panel.vue';
import FlightStrip from '@/components/FlightStrip.vue';
import { useLayoutStore } from '@/stores/layout';
import { useStripsStore } from '@/stores/strips';
import type { StripArray } from '@/types/ws-messages';

interface Props {
  title: string;
  panelId: string;
  type: StripArray;
}

const props = defineProps<Props>();

const layoutStore = useLayoutStore();
const stripsStore = useStripsStore();

// Get the appropriate array from the store based on the type prop
const flightStrips = computed(() => {
  switch (props.type) {
    case 'Planned':
      return stripsStore.planned;
    case 'Departed':
      return stripsStore.departed;
    case 'Arrived':
      return stripsStore.arrived;
    case 'Cancelled':
      return stripsStore.cancelled;
  }
});

function handleClose() {
  layoutStore.closePanel(props.panelId);
}
</script>

<template>
  <Panel :panel-key="panelId" @close="handleClose">
    <vstack gap="1">
      <FlightStrip
        v-for="strip in flightStrips"
        :key="strip.id"
        :strip-id="`${panelId}-strip-${strip.id}`"
        :strip="strip"
        :current-array="type"
      />
    </vstack>
  </Panel>
</template>
