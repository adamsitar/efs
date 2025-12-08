<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFocusable, type FocusableType } from '@/composables/useFocusable'
import { useFocusStore } from '@/stores/focus'
import { useKeybindStore } from '@/stores/keybinds'
import { useLayoutStore } from '@/stores/layout'

interface Props {
  groupId: string
  direction?: 'horizontal' | 'vertical'
  children: Array<{ id: string, type: FocusableType }>
  enableTab?: boolean
  enableCtrlArrow?: boolean
  enableArrow?: boolean
  enableNum?: boolean  // Ctrl+1-9 for direct child selection
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'vertical',
  enableTab: false,
  enableCtrlArrow: false,
  enableArrow: false,
  enableNum: false
})

const focusStore = useFocusStore()
const keybindStore = useKeybindStore()
const layoutStore = useLayoutStore()

// Find next/previous child to focus
function findChildByOffset(offset: number): { id: string, type: FocusableType } | null {
  const focused = focusStore.focused
  if (!focused) return null

  const currentIndex = props.children.findIndex(c => c.id === focused.id)
  if (currentIndex === -1) return null

  const targetIndex = currentIndex + offset
  if (targetIndex < 0 || targetIndex >= props.children.length) return null

  return props.children[targetIndex]
}

function focusNextChild() {
  const next = findChildByOffset(1)
  if (next) {
    focusStore.focus({ id: next.id, type: next.type })
  }
}

function focusPreviousChild() {
  const prev = findChildByOffset(-1)
  if (prev) {
    focusStore.focus({ id: prev.id, type: prev.type })
  }
}

function focusChildByIndex(index: number) {
  if (index >= 0 && index < props.children.length) {
    const child = props.children[index]
    focusStore.focus({ id: child.id, type: child.type })
  }
}

// Keybinds based on props
const keybinds = computed((): Record<string, Function> => {
  const bindings: Record<string, Function> = {}

  // Bare arrow navigation (for strip groups)
  if (props.enableArrow) {
    if (props.direction === 'vertical') {
      bindings['ArrowDown'] = focusNextChild
      bindings['ArrowUp'] = focusPreviousChild
    } else {
      bindings['ArrowRight'] = focusNextChild
      bindings['ArrowLeft'] = focusPreviousChild
    }
  }

  // Ctrl+Arrow navigation (orientation-based, same pattern as enableArrow)
  if (props.enableCtrlArrow) {
    if (props.direction === 'vertical') {
      bindings['ctrl+ArrowDown'] = focusNextChild
      bindings['ctrl+ArrowUp'] = focusPreviousChild
    } else {  // horizontal
      bindings['ctrl+ArrowRight'] = focusNextChild
      bindings['ctrl+ArrowLeft'] = focusPreviousChild
    }
  }

  // Tab navigation
  if (props.enableTab) {
    bindings['Tab'] = focusNextChild
    bindings['shift+Tab'] = focusPreviousChild
  }

  // Direct jump (Ctrl+1-9)
  if (props.enableNum) {
    for (let i = 1; i <= 9; i++) {
      bindings[`ctrl+${i}`] = () => focusChildByIndex(i - 1)
    }
  }

  return bindings
})

// Use focusable with auto-transfer
const { handleClick } = useFocusable(
  props.groupId,
  'group',
  {
    children: computed(() => props.children),
    keybinds: keybinds.value
  }
)

// Get focus hierarchy from leaf to root using layout store
function getFocusHierarchy(focused: any): Array<{ id: string, type: string }> {
  if (!focused) return []

  const hierarchy = [focused]

  // If focused element is a strip, find its parent panel first
  let currentId = focused.id
  if (focused.type === 'strip') {
    // Strip IDs are like 'panel-X-strip-Y', extract panel ID
    const panelIdMatch = focused.id.match(/^(.+?)-strip-/)
    if (panelIdMatch) {
      const panelId = panelIdMatch[1]

      // Insert Group between strip and panel in hierarchy
      hierarchy.push({ id: `${panelId}-group`, type: 'group' })
      hierarchy.push({ id: panelId, type: 'panel' })
      currentId = panelId
    }
  }

  // Walk up layout tree to build complete hierarchy (includes Splitters)
  let currentNode = layoutStore.findNode(currentId)

  while (currentNode) {
    const parent = layoutStore.findParent(currentNode.id)
    if (!parent) break

    // Add the auto-generated Group for this Splitter
    if (parent.type === 'splitter') {
      hierarchy.push({ id: `${parent.id}-group`, type: 'group' })
    }

    hierarchy.push({ id: parent.id, type: parent.type })
    currentNode = parent
  }

  return hierarchy
}

// Keyboard event handler with pure bubbling architecture
function handleKeyDown(event: KeyboardEvent) {
  const focused = focusStore.focused
  if (!focused) return

  // Build focus hierarchy and try keybind bubbling
  const hierarchy = getFocusHierarchy(focused)

  for (const level of hierarchy) {
    if (keybindStore.tryExecute(level.id, event)) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
  }
}

// Set initial focus on mount
onMounted(() => {
  // Only auto-focus if this is the root group (or if no element is focused)
  if (!focusStore.focused && props.children.length > 0) {
    const firstChild = props.children[0]
    focusStore.focus({ id: firstChild.id, type: firstChild.type })
  }
})
</script>

<template>
  <div class="h-full w-full" tabindex="0" @keydown="handleKeyDown" @click="handleClick" @focusout.capture="(e) => {
    // Keep focus trapped
    const target = e.currentTarget as HTMLElement | null;
    if (target && !target.contains(e.relatedTarget as Node)) {
      target.focus();
    }
  }">
    <slot />
  </div>
</template>
