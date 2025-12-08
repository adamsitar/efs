import { computed, onMounted, onUnmounted, ref, watch, nextTick, unref, type Ref, type ComputedRef } from 'vue'
import { useFocusStore } from '@/stores/focus'
import { useKeybindStore } from '@/stores/keybinds'

export type FocusableType = 'panel' | 'strip' | 'field' | 'menu-item' | 'group'

export interface UseFocusableOptions {
  keybinds?: Record<string, Function>
  children?: ComputedRef<Array<{ id: string, type: FocusableType }>> | Ref<Array<{ id: string, type: FocusableType }>>
  onFocusGain?: () => void
}

export function useFocusable(
  id: string,
  type: FocusableType,
  options?: UseFocusableOptions
) {
  const focusStore = useFocusStore()
  const keybindStore = useKeybindStore()

  // Check if this element is currently focused
  const isFocused = computed(() => focusStore.isFocused(id))

  // Check if this element is in the focus path (directly focused or has a focused child)
  const isInFocusPath = computed(() => {
    const focused = focusStore.focused
    if (!focused) return false

    // If directly focused
    if (focused.id === id) return true

    // If a child (strip) is focused, check if it belongs to this element
    if (focused.type === 'strip' && focused.id.startsWith(id + '-strip-')) {
      return true
    }

    return false
  })

  // Track last focused child (for Groups with auto-transfer)
  const lastFocusedChildId = ref<string | null>(null)

  // Watch for child focus changes to remember which child was last focused
  if (options?.children) {
    watch(() => focusStore.focused, (focused) => {
      if (!focused) return

      // Check if focused element is one of our children
      const children = unref(options.children!)
      const isChild = children.some(child => child.id === focused.id)

      if (isChild) {
        lastFocusedChildId.value = focused.id
      }
    })
  }

  // Auto-transfer focus to child when we gain focus
  watch(isFocused, (nowFocused, wasFocused) => {
    if (nowFocused && !wasFocused) {
      // Just gained focus

      // Call custom callback if provided
      if (options?.onFocusGain) {
        options.onFocusGain()
      }

      // Auto-transfer to child if we have children
      if (options?.children) {
        const children = unref(options.children)
        if (children.length === 0) return

        // Focus last focused child, or first child if none remembered
        const childToFocus = children.find(c => c.id === lastFocusedChildId.value) || children[0]

        nextTick(() => {
          focusStore.focus({
            id: childToFocus.id,
            type: childToFocus.type
          })
        })
      }
    }
  })

  // Register keybinds on mount
  onMounted(() => {
    if (options?.keybinds) {
      keybindStore.register(id, options.keybinds)
    }
  })

  // Unregister keybinds on unmount
  onUnmounted(() => {
    keybindStore.unregister(id)
  })

  // Focus this element
  function focusMyself() {
    focusStore.focus({
      id,
      type,
    })
  }

  // Handle mouse clicks (both left and right click)
  function handleClick(event: MouseEvent) {
    event.stopPropagation()
    focusMyself()
  }

  return {
    isFocused,
    isInFocusPath,
    focusMyself,
    handleClick,
    lastFocusedChildId,
  }
}
