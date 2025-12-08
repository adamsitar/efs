<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFocusable } from '@/composables/useFocusable'
import { useFocusStore } from '@/stores/focus'
import { useKeybindMetadataStore } from '@/stores/keybindMetadata'
import { useLayoutStore } from '@/stores/layout'

interface Props {
  title: string
  panelId: string
  closable?: boolean
  hasGroup?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
  hasGroup: false
})

const emit = defineEmits<{
  close: []
}>()

const panelEl = ref<HTMLElement>()
const focusStore = useFocusStore()
const metadataStore = useKeybindMetadataStore()
const layoutStore = useLayoutStore()

const isFocused = computed(() => focusStore.isFocused(panelEl.value ?? null))
const isInFocusPath = computed(() => focusStore.isInFocusPath(panelEl.value ?? null))

const focusClasses = computed(() => {
  if (isFocused.value) return 'focus-indicator-active'
  if (isInFocusPath.value) return 'focus-indicator-ancestor'
  return ''
})

// Track last focused child if this panel has a Group
const { handleFocus } = useFocusable(panelEl, {
  containerEl: props.hasGroup ? panelEl : undefined
})

// Register keybind metadata
onMounted(() => {
  metadataStore.register(props.panelId, {
    'q': {
      key: 'q',
      symbol: 'q',
      name: 'Close panel',
      description: 'Closes the current panel and focuses the next panel',
      group: 'Panel'
    },
    '|': {
      key: '|',
      symbol: '|',
      name: 'Split horizontal',
      description: 'Splits the panel horizontally',
      group: 'Panel'
    },
    '-': {
      key: '-',
      symbol: '-',
      name: 'Split vertical',
      description: 'Splits the panel vertically',
      group: 'Panel'
    }
  })
})

onUnmounted(() => {
  metadataStore.unregister(props.panelId)
})

function handleKeyDown(event: KeyboardEvent) {
  // Panel-specific keys
  if (event.key === 'q') {
    const nextPanelId = layoutStore.closePanel(props.panelId)
    if (nextPanelId) {
      // Find next panel element and focus it
      const nextPanel = document.querySelector(`[data-panel-id="${nextPanelId}"]`) as HTMLElement
      nextPanel?.focus()
    }
    event.preventDefault()
    event.stopPropagation()
    return
  }

  if (event.key === '|') {
    layoutStore.splitPanel(props.panelId, 'horizontal')
    event.preventDefault()
    event.stopPropagation()
    return
  }

  if (event.key === '-') {
    layoutStore.splitPanel(props.panelId, 'vertical')
    event.preventDefault()
    event.stopPropagation()
    return
  }

  // Key not handled, let it bubble
}

function handleClick(event: MouseEvent) {
  event.stopPropagation()
  panelEl.value?.focus()
}
</script>

<template>
  <div
    ref="panelEl"
    :data-panel-id="panelId"
    :data-focusable-id="panelId"
    data-focusable-type="panel"
    class="h-full flex flex-col border border-border-default bg-panel"
    tabindex="0"
    :class="focusClasses"
    @focus.self="handleFocus"
    @keydown="handleKeyDown"
    @click="handleClick"
    @contextmenu="handleClick"
  >
    <!-- Heading bar -->
    <div class="flex items-center justify-between px-2 py-1 border-b border-default min-h-7">
      <div class="text-sm text-primary">
        {{ title }}
      </div>
      <div
        v-if="closable"
        class="i-ph-x cursor-pointer text-primary hover:text-accent transition-colors"
        @click="emit('close')"
      />
    </div>

    <!-- Content area -->
    <div class="flex-1 overflow-auto p-2">
      <slot />
    </div>
  </div>
</template>
