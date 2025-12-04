<script setup lang="ts">
import { ref, computed } from 'vue';
import Panel from '@/components/Panel.vue';
import FlightStrip from '@/components/FlightStrip.vue';
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

interface FlightStripData {
  id: string;
  callsign: string;
  currentAltitude: string;
  clearedAltitude: string;
  speed: string;
  runway: string;
}

const flightStrips = ref<FlightStripData[]>([
  { id: '1', callsign: 'AAL123', currentAltitude: 'FL350', clearedAltitude: 'FL370', speed: 'M.82', runway: '24L' },
  { id: '2', callsign: 'DAL456', currentAltitude: 'FL280', clearedAltitude: 'FL310', speed: 'M.78', runway: '24R' },
  { id: '3', callsign: 'UAL789', currentAltitude: 'FL330', clearedAltitude: 'FL350', speed: 'M.80', runway: '24L' },
  { id: '4', callsign: 'SWA321', currentAltitude: 'FL300', clearedAltitude: 'FL320', speed: 'M.76', runway: '24R' },
  { id: '5', callsign: 'JBU567', currentAltitude: 'FL340', clearedAltitude: 'FL360', speed: 'M.79', runway: '24L' },
]);

function handleClose() {
  console.log('Close panel:', props.title);
  // TODO: Dispatch action to layout store to close this panel
}
</script>

<template>
  <Panel :title="title" :focused="isFocused" @close="handleClose">
    <col gap="2">
      <FlightStrip
        v-for="strip in flightStrips"
        :key="strip.id"
        :callsign="strip.callsign"
        :current-altitude="strip.currentAltitude"
        :cleared-altitude="strip.clearedAltitude"
        :speed="strip.speed"
        :runway="strip.runway"
      />
    </col>
  </Panel>
</template>
