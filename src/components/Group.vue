<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useFocusable } from '@/composables/useFocusable'
import { useKeybindMetadataStore } from '@/stores/keybindMetadata'

interface Props {
  groupId: string
  direction?: 'horizontal' | 'vertical'
  isRoot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'vertical',
  isRoot: false
})

const groupEl = ref<HTMLElement>()
const metadataStore = useKeybindMetadataStore()

// Track last focused child for auto-transfer
const { handleFocus } = useFocusable(groupEl, {
  containerEl: groupEl
})

// Register keybind metadata based on direction and isRoot
onMounted(() => {
  const metadata: Record<string, any> = {}

  // Orientation-based Ctrl+Arrow
  if (props.direction === 'vertical') {
    metadata['ctrl+ArrowDown'] = {
      key: 'ctrl+ArrowDown',
      symbol: 'Ctrl+↓',
      name: 'Next item',
      description: 'Focus next item in vertical group',
      group: 'Navigation'
    }
    metadata['ctrl+ArrowUp'] = {
      key: 'ctrl+ArrowUp',
      symbol: 'Ctrl+↑',
      name: 'Previous item',
      description: 'Focus previous item in vertical group',
      group: 'Navigation'
    }
  } else {
    metadata['ctrl+ArrowRight'] = {
      key: 'ctrl+ArrowRight',
      symbol: 'Ctrl+→',
      name: 'Next item',
      description: 'Focus next item in horizontal group',
      group: 'Navigation'
    }
    metadata['ctrl+ArrowLeft'] = {
      key: 'ctrl+ArrowLeft',
      symbol: 'Ctrl+←',
      name: 'Previous item',
      description: 'Focus previous item in horizontal group',
      group: 'Navigation'
    }
  }

  // Tab navigation
  metadata['Tab'] = {
    key: 'Tab',
    symbol: 'Tab',
    name: 'Next',
    description: 'Focus next item',
    group: 'Navigation'
  }
  metadata['shift+Tab'] = {
    key: 'shift+Tab',
    symbol: 'Shift+Tab',
    name: 'Previous',
    description: 'Focus previous item',
    group: 'Navigation'
  }

  // Ctrl+Num (only for root)
  if (props.isRoot) {
    for (let i = 1; i <= 9; i++) {
      metadata[`ctrl+${i}`] = {
        key: `ctrl+${i}`,
        symbol: `Ctrl+${i}`,
        name: `Jump to panel ${i}`,
        description: `Directly focus panel ${i}`,
        group: 'Navigation'
      }
    }
  }

  metadataStore.register(props.groupId, metadata)
})

onUnmounted(() => {
  metadataStore.unregister(props.groupId)
})

// Get all focusable children (elements with tabindex)
function getFocusableChildren(): HTMLElement[] {
  if (!groupEl.value) return []
  return Array.from(groupEl.value.querySelectorAll('[tabindex]:not([tabindex="-1"])'))
}

function focusNextChild() {
  const children = getFocusableChildren()
  if (children.length === 0) return

  const currentIndex = children.indexOf(document.activeElement as HTMLElement)
  const nextIndex = (currentIndex + 1) % children.length
  children[nextIndex].focus()
}

function focusPreviousChild() {
  const children = getFocusableChildren()
  if (children.length === 0) return

  const currentIndex = children.indexOf(document.activeElement as HTMLElement)
  const prevIndex = (currentIndex - 1 + children.length) % children.length
  children[prevIndex].focus()
}

function focusChildByIndex(index: number) {
  const children = getFocusableChildren()
  if (index >= 0 && index < children.length) {
    children[index].focus()
  }
}

// Keyboard handler using native DOM bubbling
function handleKeyDown(event: KeyboardEvent) {
  // Orientation-based Ctrl+Arrow navigation
  if (event.ctrlKey) {
    if (props.direction === 'vertical') {
      if (event.key === 'ArrowDown') {
        focusNextChild()
        event.preventDefault()
        event.stopPropagation()
        return
      }
      if (event.key === 'ArrowUp') {
        focusPreviousChild()
        event.preventDefault()
        event.stopPropagation()
        return
      }
    } else { // horizontal
      if (event.key === 'ArrowRight') {
        focusNextChild()
        event.preventDefault()
        event.stopPropagation()
        return
      }
      if (event.key === 'ArrowLeft') {
        focusPreviousChild()
        event.preventDefault()
        event.stopPropagation()
        return
      }
    }
  }

  // Ctrl+Num (only for root group)
  if (props.isRoot && event.ctrlKey && /^[1-9]$/.test(event.key)) {
    const index = parseInt(event.key) - 1
    focusChildByIndex(index)
    event.preventDefault()
    event.stopPropagation()
    return
  }

  // Tab navigation (sequential)
  if (event.key === 'Tab') {
    if (event.shiftKey) {
      focusPreviousChild()
    } else {
      focusNextChild()
    }
    event.preventDefault()
    event.stopPropagation()
    return
  }

  // If key not handled, let it bubble to parent naturally
}
</script>

<template>
  <div
    ref="groupEl"
    :data-focusable-id="groupId"
    data-focusable-type="group"
    class="group h-full w-full"
    tabindex="-1"
    @focus.self="handleFocus"
    @keydown="handleKeyDown"
  >
    <slot />
  </div>
</template>
