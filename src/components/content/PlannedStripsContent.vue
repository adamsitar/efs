<script setup lang="ts">
import { computed } from 'vue';
import FlightStrip from '@/components/FlightStrip.vue';
import { useStripsStore } from '@/stores/strips';

interface Props {
  panelKey: string;
}

defineProps<Props>();

const stripsStore = useStripsStore();
const flightStrips = computed(() => {
  // Sort by last_modified in descending order (most recent first)
  return [...stripsStore.planned].sort((a, b) => b.last_modified - a.last_modified);
});
</script>

<template>
  <vstack gap="1">
    <FlightStrip
      v-for="strip in flightStrips"
      :key="strip.id"
      :strip-id="`${panelKey}-strip-${strip.id}`"
      :strip="strip"
      current-array="Planned"
    />
  </vstack>
</template>
