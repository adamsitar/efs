<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useServerConnection } from '@/composables/useServerConnection';
import { useModalsStore } from '@/stores/modals';
import type { Strip, StripArray } from '@/types/ws-messages';

interface Props {
  stripId: string;
  strip: Strip;
  currentArray: StripArray;
}

const props = defineProps<Props>();

const { send } = useServerConnection();
const modalsStore = useModalsStore();

// Extract wake turbulence category from aircraft type if present
// The wake turbulence is a separate field in the Strip type
const displayAircraftType = computed(() => {
  return `${props.strip.aircraft_type}/${props.strip.wake_turbulence}`;
});

// For now, we'll default count to 1 since it's not in the Strip type
const count = 1;

// Format timestamp as relative time for recent updates, absolute for older
const formattedTimestamp = ref('');

const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // For very recent changes (< 1 minute), show seconds
  if (seconds < 60) {
    return `${seconds}s ago`;
  }
  // For recent changes (< 1 hour), show minutes
  else if (minutes < 60) {
    return `${minutes}m ago`;
  }
  // For changes within the last 24 hours, show hours
  else if (hours < 24) {
    return `${hours}h ago`;
  }
  // For older changes, show the actual time
  else {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    if (days === 1) {
      return `Yesterday ${timeStr}`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      // Show date for very old strips
      return date.toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }
};

const updateTimestamp = () => {
  formattedTimestamp.value = formatRelativeTime(props.strip.last_modified);
};

// Update timestamp every 10 seconds to keep it fresh
let intervalId: number | null = null;

onMounted(() => {
  updateTimestamp();
  intervalId = window.setInterval(updateTimestamp, 10000);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});

const openEditModal = (event: Event) => {
  event.stopPropagation();
  const modalKey = `edit-strip-${props.stripId}`;
  modalsStore.openModal({
    key: modalKey,
    title: `Edit Strip - ${props.strip.callsign}`,
    props: { strip: props.strip, currentArray: props.currentArray, modalKey },
    width: 600,
    height: 700,
  });
};
</script>

<template>
  <div
    :data-strip-id="stripId"
    v-on:click="
      () => {
        send(`stripId: ${stripId}`);
      }
    "
    class="border rounded-xs border-border-default bg-panel hover:bg-elevated transition-colors font-mono cursor-pointer"
  >
    <!-- Row 1: Aircraft Type/Wake | Num Aircraft | ADEP -->
    <div class="grid grid-cols-[1fr_40px_120px] border-b border-border-default text-xs">
      <div class="border-r border-border-default px-2 py-1 text-primary">
        {{ displayAircraftType }}
      </div>
      <div class="border-r border-border-default px-2 py-1 text-center text-primary">
        {{ count }}
      </div>
      <div class="px-2 py-1 text-primary font-semibold">{{ strip.departure_aerodrome }}</div>
    </div>

    <!-- Row 2: CALLSIGN (large) | Flight Rules + Speed/Level -->
    <div class="grid grid-cols-[1fr_120px] border-b border-border-default">
      <div class="border-r border-border-default px-2 py-2 text-primary font-bold text-lg">
        {{ strip.callsign }}
      </div>
      <div class="px-2 py-2 text-primary font-semibold text-base text-center">
        {{ strip.flight_rules }}
      </div>
    </div>

    <!-- Row 3: Speed/Level | Route (truncated) | ADES -->
    <div class="grid grid-cols-[auto_1fr_120px] text-xs">
      <!-- Speed and Level -->
      <div class="flex border-r border-border-default">
        <div class="border-r border-border-default px-2 py-1 text-secondary text-center min-w-16">
          {{ strip.cruising_speed }}
        </div>
        <div class="border-r border-border-default px-2 py-1 text-secondary text-center min-w-16">
          {{ strip.cruising_level }}
        </div>
      </div>
      <div class="border-r border-border-default px-2 py-1 text-secondary truncate">
        {{ strip.route || '-' }}
      </div>
      <div class="px-2 py-1 text-primary font-semibold relative">
        {{ strip.destination_aerodrome }}
        <div class="absolute bottom-0.5 right-1 flex items-center gap-1">
          <span class="text-[9px] text-secondary opacity-60">
            {{ formattedTimestamp }}
          </span>
          <button
            @click="openEditModal"
            class="p-0.5 text-secondary hover:text-primary opacity-60 hover:opacity-100 transition-opacity"
            title="Edit strip"
          >
            <div class="i-ph-pencil-simple w-3 h-3"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
