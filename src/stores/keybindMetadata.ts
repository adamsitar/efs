import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface KeybindMetadata {
  key: string           // The actual key: "q", "ctrl+ArrowRight"
  symbol: string        // Display symbol: "q", "Ctrl+→"
  name: string          // Action name: "Close panel"
  description?: string  // Optional longer description
  group?: string        // Optional grouping: "Panel", "Navigation"
}

export const useKeybindMetadataStore = defineStore('keybindMetadata', () => {
  // Map of componentId -> keybind metadata
  const metadata = ref(new Map<string, Record<string, KeybindMetadata>>())

  function register(componentId: string, bindings: Record<string, KeybindMetadata>) {
    metadata.value.set(componentId, bindings)
  }

  function unregister(componentId: string) {
    metadata.value.delete(componentId)
  }

  function getMetadata(componentId: string): Record<string, KeybindMetadata> {
    return metadata.value.get(componentId) || {}
  }

  // Get all metadata for elements in focus path
  function getAllMetadataForPath(focusPath: HTMLElement[]): KeybindMetadata[] {
    const allMetadata: KeybindMetadata[] = []

    for (const element of focusPath) {
      const id = element.dataset.focusableId
      if (id) {
        const elementMetadata = getMetadata(id)
        allMetadata.push(...Object.values(elementMetadata))
      }
    }

    return allMetadata
  }

  return {
    register,
    unregister,
    getMetadata,
    getAllMetadataForPath
  }
})
