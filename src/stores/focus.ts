import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFocusStore = defineStore('focus', () => {
  // Current focused element (for reactivity)
  const focusedElement = ref<HTMLElement | null>(null)

  // Focus path from focused element to root (array of focusable ancestors)
  const focusPath = ref<HTMLElement[]>([])

  // Build focus path by walking up DOM from focused element
  function buildFocusPath(element: HTMLElement | null): HTMLElement[] {
    const path: HTMLElement[] = []
    let current = element

    while (current && current !== document.body) {
      // Only include elements with tabindex (focusable elements)
      if (current.hasAttribute('tabindex')) {
        path.push(current)
      }
      current = current.parentElement
    }

    return path
  }

  // Watch native focus changes
  if (typeof document !== 'undefined') {
    document.addEventListener('focusin', (event) => {
      const target = event.target as HTMLElement
      focusedElement.value = target
      focusPath.value = buildFocusPath(target)
    })

    document.addEventListener('focusout', () => {
      // Small delay to let new focus settle
      setTimeout(() => {
        if (!document.activeElement || document.activeElement === document.body) {
          focusedElement.value = null
          focusPath.value = []
        }
      }, 0)
    })
  }

  function isFocused(element: HTMLElement | null): boolean {
    if (!element) return false
    return focusedElement.value === element
  }

  function isInFocusPath(element: HTMLElement | null): boolean {
    if (!element) return false
    return focusPath.value.includes(element)
  }

  return {
    focusedElement,
    focusPath,
    isFocused,
    isInFocusPath
  }
})
