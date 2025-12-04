import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFocusStore = defineStore('focus', () => {
  // Currently focused element ID
  const focusedId = ref<string | null>(null);

  // Focus an element by ID
  function focus(id: string | null) {
    focusedId.value = id;
  }

  // Check if a specific ID is focused
  function isFocused(id: string) {
    return focusedId.value === id;
  }

  return {
    focusedId,
    focus,
    isFocused
  };
});
