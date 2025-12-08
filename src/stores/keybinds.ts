import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useKeybindStore = defineStore('keybinds', () => {
  const keybinds = ref<Map<string, Record<string, Function>>>(new Map())

  function register(componentId: string, bindings: Record<string, Function>) {
    keybinds.value.set(componentId, bindings)
  }

  function unregister(componentId: string) {
    keybinds.value.delete(componentId)
  }

  function tryExecute(componentId: string, event: KeyboardEvent): boolean {
    const bindings = keybinds.value.get(componentId)
    if (!bindings) {
      console.log(`[Keybind] No bindings for component:`, componentId)
      return false
    }

    // Build key string with modifiers
    let keyString = ''
    if (event.ctrlKey) keyString += 'ctrl+'
    if (event.shiftKey) keyString += 'shift+'
    if (event.altKey) keyString += 'alt+'
    if (event.metaKey) keyString += 'meta+'
    keyString += event.key

    console.log(`[Keybind] Trying to match '${keyString}' for component:`, componentId)
    console.log(`[Keybind] Available bindings:`, Object.keys(bindings))

    // Try exact match first (with modifiers)
    if (bindings[keyString]) {
      console.log(`[Keybind] Exact match found for '${keyString}'`)
      bindings[keyString]()
      return true
    }

    // Try bare key (backward compatibility)
    // Only match if NO modifiers present (prevent conflicts)
    if (bindings[event.key]) {
      const hasModifiers = event.ctrlKey || event.shiftKey || event.altKey || event.metaKey
      if (!hasModifiers) {
        console.log(`[Keybind] Bare key match found for '${event.key}'`)
        bindings[event.key]()
        return true
      } else {
        console.log(`[Keybind] Bare key '${event.key}' skipped due to modifiers`)
      }
    }

    console.log(`[Keybind] No match found for '${keyString}'`)
    return false
  }

  return { register, unregister, tryExecute }
})
