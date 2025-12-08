<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFocusStore } from '@/stores/focus'

interface Props {
  // Focus system
  stripId: string

  // Aircraft identification
  callsign: string
  flightNumber: string
  aircraftType: string
  registration: string

  // Route
  adep: string
  ades: string

  // Equipment codes (individual characters)
  equipmentCodes?: string[]
  count?: number
}

withDefaults(defineProps<Props>(), {
  equipmentCodes: () => [],
  count: 1
})

const stripEl = ref<HTMLElement>()
const focusStore = useFocusStore()

const isFocused = computed(() => focusStore.isFocused(stripEl.value ?? null))
const isInFocusPath = computed(() => focusStore.isInFocusPath(stripEl.value ?? null))

const focusClasses = computed(() => {
  if (isFocused.value) return 'focus-indicator-active'
  if (isInFocusPath.value) return 'focus-indicator-ancestor'
  return ''
})

function handleClick(event: MouseEvent) {
  event.stopPropagation()
  stripEl.value?.focus()
}

function handleKeyDown(_event: KeyboardEvent) {
  // Strip-specific keys (if needed in future)
  // For now, let everything bubble to parent Group
}
</script>

<template>
  <div
    ref="stripEl"
    :data-strip-id="stripId"
    :data-focusable-id="stripId"
    data-focusable-type="strip"
    class="border border-border-default bg-panel hover:bg-elevated transition-colors font-mono cursor-pointer"
    tabindex="0"
    :class="focusClasses"
    @click="handleClick"
    @contextmenu="handleClick"
    @keydown="handleKeyDown"
  >
    <!-- Row 1: Aircraft Type/Wake | Num Aircraft | ADEP -->
    <div class="grid grid-cols-[1fr_40px_120px] border-b border-border-default text-xs">
      <div class="border-r border-border-default px-2 py-1 text-primary">{{ aircraftType }}</div>
      <div class="border-r border-border-default px-2 py-1 text-center text-primary">{{ count }}</div>
      <div class="px-2 py-1 text-primary font-semibold">{{ adep }}</div>
    </div>

    <!-- Row 2: CALLSIGN (large) | Flight Number -->
    <div class="grid grid-cols-[1fr_120px] border-b border-border-default">
      <div class="border-r border-border-default px-2 py-2 text-primary font-bold text-lg">{{ callsign }}</div>
      <div class="px-2 py-2 text-primary font-semibold text-base text-center">{{ flightNumber }}</div>
    </div>

    <!-- Row 3: Equipment codes | TailNo | ADES -->
    <div class="grid grid-cols-[auto_1fr_120px] text-xs">
      <!-- Equipment codes as individual boxes -->
      <div class="flex border-r border-border-default">
        <div
          v-for="(code, idx) in equipmentCodes"
          :key="idx"
          class="border-r border-border-default px-2 py-1 text-secondary text-center min-w-8"
        >
          {{ code }}
        </div>
      </div>
      <div class="border-r border-border-default px-2 py-1 text-secondary">{{ registration }}</div>
      <div class="px-2 py-1 text-primary font-semibold">{{ ades }}</div>
    </div>
  </div>
</template>
