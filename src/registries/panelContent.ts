import type { Component } from 'vue';
import PlannedStripsContent from '@/components/content/PlannedStripsContent.vue';
import DepartedStripsContent from '@/components/content/DepartedStripsContent.vue';
import ArrivedStripsContent from '@/components/content/ArrivedStripsContent.vue';
import CancelledStripsContent from '@/components/content/CancelledStripsContent.vue';

// Panel content metadata
export interface PanelContentMeta {
  key: string;
  titleKey: string; // i18n translation key
  component: Component;
}

// Registry of all available panel content types
export const panelContentRegistry: Record<string, PanelContentMeta> = {
  'planned-strips': {
    key: 'planned-strips',
    titleKey: 'panels.planned',
    component: PlannedStripsContent,
  },
  'departed-strips': {
    key: 'departed-strips',
    titleKey: 'panels.departed',
    component: DepartedStripsContent,
  },
  'arrived-strips': {
    key: 'arrived-strips',
    titleKey: 'panels.arrived',
    component: ArrivedStripsContent,
  },
  'cancelled-strips': {
    key: 'cancelled-strips',
    titleKey: 'panels.cancelled',
    component: CancelledStripsContent,
  },
};

// Helper to get panel content metadata by key
export function getPanelContent(key: string): PanelContentMeta | undefined {
  return panelContentRegistry[key];
}

// Get all available panel content types (for dropdown)
export function getAllPanelContentTypes(): PanelContentMeta[] {
  return Object.values(panelContentRegistry);
}
