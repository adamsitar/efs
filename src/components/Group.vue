<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useLayoutStore } from '@/stores/layout';
import { useFocusStore } from '@/stores/focus';

const layoutStore = useLayoutStore();
const focusStore = useFocusStore();

const panels = computed(() => layoutStore.allPanels);

// Get current focused panel index (for navigation)
const focusedIndex = computed(() => {
  return panels.value.findIndex(p => p.id === focusStore.focusedId);
});

// Focus panel by index
function focusPanel(index: number) {
  if (index >= 0 && index < panels.value.length) {
    const panel = panels.value[index];
    focusStore.focus(panel.id);
    console.log(`Focused panel ${index}:`, panel.component);
  }
}

// Navigate panels
function nextPanel() {
  const currentIndex = focusedIndex.value;
  const nextIndex = (currentIndex + 1) % panels.value.length;
  focusPanel(nextIndex);
}

function prevPanel() {
  const currentIndex = focusedIndex.value;
  const prevIndex = (currentIndex - 1 + panels.value.length) % panels.value.length;
  focusPanel(prevIndex);
}

// Keyboard event handler
function handleKeyDown(event: KeyboardEvent) {
  // Ctrl+1/2/3 for direct panel selection
  if (event.ctrlKey && event.key >= '1' && event.key <= '9') {
    event.preventDefault();
    const index = parseInt(event.key) - 1;
    if (index < panels.value.length) {
      focusPanel(index);
    }
    return;
  }

  // Ctrl+Arrow for panel navigation
  if (event.ctrlKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
    event.preventDefault();
    if (event.key === 'ArrowRight') {
      nextPanel();
    } else {
      prevPanel();
    }
    return;
  }

  // Tab for panel cycling (override default)
  if (event.key === 'Tab') {
    event.preventDefault();
    if (event.shiftKey) {
      prevPanel();
    } else {
      nextPanel();
    }
    return;
  }
}

// Set initial focus on mount
onMounted(() => {
  focusPanel(0);
});
</script>

<template>
  <div class="h-full w-full" tabindex="0" @keydown="handleKeyDown" @focusout.capture="(e) => {
    // Keep focus trapped - refocus if focus leaves
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      (e.currentTarget as HTMLElement).focus();
    }
  }">
    <slot />
  </div>
</template>
