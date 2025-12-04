<script setup lang="ts">
interface Props {
  callsign: string;
  currentAltitude: string;
  clearedAltitude: string;
  speed: string;
  runway: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="border border-border-default bg-panel-hover hover:bg-elevated transition-colors p-2 font-mono text-sm cursor-pointer">
    <div class="flex items-center justify-between gap-3">
      <span class="text-primary font-semibold">{{ callsign }}</span>
      <span class="text-primary">{{ currentAltitude }} → {{ clearedAltitude }}</span>
      <span class="text-secondary">{{ speed }}</span>
      <span class="text-muted text-xs">{{ runway }}</span>
    </div>
  </div>
</template>
