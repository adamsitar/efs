<script setup lang="ts">
import { computed } from 'vue'
import { useFocusable, type FocusableType } from '@/composables/useFocusable'
import { useLayoutStore } from '@/stores/layout'
import { useFocusStore } from '@/stores/focus'

interface Props {
  title: string;
  panelId: string;
  closable?: boolean;
  hasGroup?: boolean;  // Does this panel contain a Group component?
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
  hasGroup: false  // Default: no Group child
});

const emit = defineEmits<{
  close: [];
}>();

const layoutStore = useLayoutStore()
const focusStore = useFocusStore()

// Use focusable composable with keybinds registered
// Auto-transfer focus to child Group only if this panel has one
const { isFocused, isInFocusPath, handleClick } = useFocusable(
  props.panelId,
  'panel',
  {
    // Only add children if this panel has a Group
    children: props.hasGroup ? computed(() => [
      { id: `${props.panelId}-group`, type: 'group' as FocusableType }
    ]) : undefined,
    keybinds: {
      'q': () => {
        const nextPanelId = layoutStore.closePanel(props.panelId)
        if (nextPanelId) {
          focusStore.focus({ id: nextPanelId, type: 'panel' })
        }
      },
      '|': () => layoutStore.splitPanel(props.panelId, 'horizontal'),
      '-': () => layoutStore.splitPanel(props.panelId, 'vertical')
    }
  }
)

const focusClasses = computed(() => {
  if (isFocused.value) return 'focus-indicator-active'
  if (isInFocusPath.value) return 'focus-indicator-ancestor'
  return ''
})
</script>

<template>
  <div class="h-full flex flex-col border border-border-default bg-panel" :class="focusClasses" @click="handleClick"
    @contextmenu="handleClick">
    <!-- Heading bar -->
    <div class="flex items-center justify-between px-2 py-1 border-b border-default min-h-7">
      <div class="text-sm text-primary">
        {{ title }}
      </div>
      <div v-if="closable" class="i-ph-x cursor-pointer text-primary hover:text-accent transition-colors"
        @click="emit('close')" />
    </div>

    <!-- Content area -->
    <div class="flex-1 overflow-auto p-2">
      <slot />
    </div>
  </div>
</template>
