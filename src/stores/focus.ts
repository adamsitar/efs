import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface FocusInfo {
  id: string;
  type: 'panel' | 'strip' | 'field' | 'menu-item' | 'group';
}

export const useFocusStore = defineStore('focus', () => {
  // Currently focused element
  const focused = ref<FocusInfo | null>(null);

  // Focus an element
  function focus(info: FocusInfo | null) {
    focused.value = info;
  }

  // Check if a specific ID is focused
  function isFocused(id: string) {
    return focused.value?.id === id;
  }

  // Get the type of the focused element
  function getFocusedType(): string | null {
    return focused.value?.type ?? null;
  }

  return {
    focused,
    focus,
    isFocused,
    getFocusedType
  };
});
