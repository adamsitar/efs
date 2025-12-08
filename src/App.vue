<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useFocusStore } from '@/stores/focus'
import { useKeybindMetadataStore } from '@/stores/keybindMetadata'
import WhichKeyMenu from '@/components/WhichKeyMenu.vue'

const layoutStore = useLayoutStore()
const focusStore = useFocusStore()
const metadataStore = useKeybindMetadataStore()

const showWhichKey = ref(false)

// Compute available keybinds for current focus path
const whichKeyBinds = computed(() => {
  return metadataStore.getAllMetadataForPath(focusStore.focusPath)
})

function handleGlobalKeys(event: KeyboardEvent) {
  // Toggle which-key menu with ?
  if (event.key === '?' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    showWhichKey.value = !showWhichKey.value
    event.preventDefault()
    return
  }
}
</script>

<template>
  <div class="h-screen w-screen bg-base" @keydown="handleGlobalKeys">
    <splitter :node="layoutStore.root" :is-root="true" />

    <!-- Which-Key Menu -->
    <WhichKeyMenu
      v-if="showWhichKey"
      :keybinds="whichKeyBinds"
      @close="showWhichKey = false"
    />
  </div>
</template>
