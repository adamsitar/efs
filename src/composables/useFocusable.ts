import { ref, watchEffect, type Ref } from 'vue'

export type FocusableType = 'panel' | 'strip' | 'field' | 'menu-item' | 'group'

export interface UseFocusableOptions {
  // For containers: track last focused child for auto-transfer
  containerEl?: Ref<HTMLElement | undefined>
  onFocus?: () => void
  onBlur?: () => void
}

export function useFocusable(
  elementRef: Ref<HTMLElement | undefined>,
  options?: UseFocusableOptions
) {
  const lastFocusedChild = ref<HTMLElement | null>(null)

  // Track last focused child (for auto-transfer)
  if (options?.containerEl) {
    watchEffect(() => {
      const container = options.containerEl!.value
      const activeEl = document.activeElement as HTMLElement

      if (container && activeEl &&
        container.contains(activeEl) &&
        activeEl !== container) {
        lastFocusedChild.value = activeEl
      }
    })
  }

  function focus() {
    elementRef.value?.focus()
  }

  function handleFocus(event: FocusEvent) {
    options?.onFocus?.()

    // Auto-transfer to last focused child if this is a container
    if (options?.containerEl && lastFocusedChild.value) {
      // Only auto-transfer if focus came from outside
      const relatedTarget = event.relatedTarget as HTMLElement | null
      const container = options.containerEl.value

      if (!relatedTarget || !container?.contains(relatedTarget)) {
        // Focus came from outside, auto-transfer
        lastFocusedChild.value.focus()
      }
    }
  }

  function handleBlur() {
    options?.onBlur?.()
  }

  return {
    focus,
    handleFocus,
    handleBlur,
    lastFocusedChild
  }
}
