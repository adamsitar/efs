<script setup lang="ts">
import { computed } from 'vue'
import type { KeybindMetadata } from '@/stores/keybindMetadata'

const props = defineProps<{
  keybinds: KeybindMetadata[]
}>()

const emit = defineEmits<{
  close: []
}>()

// Group keybinds by group property
const groupedKeybinds = computed(() => {
  const groups = new Map<string, KeybindMetadata[]>()

  for (const kb of props.keybinds) {
    const group = kb.group || 'Other'
    if (!groups.has(group)) {
      groups.set(group, [])
    }
    groups.get(group)!.push(kb)
  }

  return groups
})

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' || event.key === '?') {
    emit('close')
    event.preventDefault()
  }
}
</script>

<template>
  <div
    class="which-key-overlay"
    @click="emit('close')"
    @keydown="handleKeyDown"
  >
    <div class="which-key-menu" @click.stop>
      <div class="which-key-header">
        <h2>Available Keybinds</h2>
        <button @click="emit('close')">✕</button>
      </div>

      <div
        v-for="[groupName, bindings] in groupedKeybinds"
        :key="groupName"
        class="keybind-group"
      >
        <h3 class="group-name">{{ groupName }}</h3>
        <div class="keybind-list">
          <div
            v-for="kb in bindings"
            :key="kb.key"
            class="keybind-row"
          >
            <span class="keybind-symbol">{{ kb.symbol }}</span>
            <span class="keybind-name">{{ kb.name }}</span>
            <span v-if="kb.description" class="keybind-description">
              {{ kb.description }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.which-key-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.which-key-menu {
  background: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1.5rem;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.which-key-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.which-key-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.which-key-header button {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.keybind-group {
  margin-bottom: 1.5rem;
}

.group-name {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.keybind-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.keybind-row {
  display: grid;
  grid-template-columns: 120px 200px 1fr;
  gap: 1rem;
  align-items: baseline;
}

.keybind-symbol {
  font-family: monospace;
  font-weight: 600;
  color: var(--color-accent);
  text-align: right;
}

.keybind-name {
  font-weight: 500;
}

.keybind-description {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
