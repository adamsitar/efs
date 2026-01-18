import type { Component } from 'vue';
import SettingsContent from '@/components/content/SettingsContent.vue';
import EditStripContent from '@/components/content/EditStripContent.vue';

// Registry mapping modal keys to their components
export const modalComponentRegistry: Record<string, Component> = {
  settings: SettingsContent,
  // Add more modal types here as needed
};

// Helper to get component by key
export function getModalComponent(key: string): Component | undefined {
  // Handle dynamic keys for edit-strip modals
  if (key.startsWith('edit-strip-')) {
    return EditStripContent;
  }

  return modalComponentRegistry[key];
}
