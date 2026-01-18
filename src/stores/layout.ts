import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { generateId } from '@/utils/id';
import { getAllPanelContentTypes } from '@/registries/panelContent';

export interface LayoutNode {
  key: string; // Unique identifier (e.g., 'planned-strips', 'splitter-1')
  type: 'panel' | 'splitter';
  direction?: 'horizontal' | 'vertical';
  children?: LayoutNode[];
  sizes?: number[];
}

export const useLayoutStore = defineStore(
  'layout',
  () => {
    // Root layout node - 2x2 grid with all 4 strip panel types
    const root = ref<LayoutNode>({
      key: 'root',
      type: 'splitter',
      direction: 'vertical',
      children: [
        {
          key: 'splitter-top',
          type: 'splitter',
          direction: 'horizontal',
          children: [
            {
              key: 'planned-strips',
              type: 'panel',
            },
            {
              key: 'departed-strips',
              type: 'panel',
            },
          ],
          sizes: [50, 50],
        },
        {
          key: 'splitter-bottom',
          type: 'splitter',
          direction: 'horizontal',
          children: [
            {
              key: 'arrived-strips',
              type: 'panel',
            },
            {
              key: 'cancelled-strips',
              type: 'panel',
            },
          ],
          sizes: [50, 50],
        },
      ],
      sizes: [50, 50],
    });

    // Helper: Find node by key (recursive search)
    function findNode(key: string, node: LayoutNode = root.value): LayoutNode | null {
      if (node.key === key) return node;
      if (node.type === 'splitter' && node.children) {
        for (const child of node.children) {
          const found = findNode(key, child);
          if (found) return found;
        }
      }
      return null;
    }

    // Helper: Find parent of node
    function findParent(key: string, node: LayoutNode = root.value): LayoutNode | null {
      if (node.type === 'splitter' && node.children) {
        if (node.children.some((child) => child.key === key)) {
          return node;
        }
        for (const child of node.children) {
          const found = findParent(key, child);
          if (found) return found;
        }
      }
      return null;
    }

    // Helper: Check if a panel key is already in use
    function isPanelKeyInUse(key: string): boolean {
      return allPanels.value.some((panel) => panel.key === key);
    }

    // Helper: Get available panel types (not currently in use)
    function getAvailablePanelTypes() {
      const allTypes = getAllPanelContentTypes();
      return allTypes.map((type) => ({
        ...type,
        isAvailable: !isPanelKeyInUse(type.key),
      }));
    }

    // Action: Split a panel
    function splitPanel(panelKey: string, direction: 'horizontal' | 'vertical') {
      const panel = findNode(panelKey);
      const parent = findParent(panelKey);
      if (!panel || !parent || panel.type !== 'panel') return;

      // Find an available panel type that's not already in use
      const availableTypes = getAvailablePanelTypes().filter((t) => t.isAvailable);
      if (availableTypes.length === 0) {
        console.warn('No available panel types to create');
        return;
      }

      // Use the first available type
      const newPanelKey = availableTypes[0].key;

      // Create new panel
      const newPanel: LayoutNode = {
        key: newPanelKey,
        type: 'panel',
      };

      // Create new splitter with generated key
      const newSplitter: LayoutNode = {
        key: generateId('splitter'),
        type: 'splitter',
        direction,
        children: [panel, newPanel],
        sizes: [50, 50],
      };

      // Replace panel with splitter in parent's children
      const index = parent.children!.findIndex((c) => c.key === panelKey);
      parent.children![index] = newSplitter;
    }

    // Action: Close a panel
    function closePanel(panelKey: string) {
      const parent = findParent(panelKey);
      if (!parent || parent.type !== 'splitter') return;

      // Remove panel from parent
      parent.children = parent.children!.filter((c) => c.key !== panelKey);

      // If parent now empty, remove parent from grandparent
      if (parent.children.length === 0) {
        const grandparent = findParent(parent.key);
        if (grandparent && grandparent.type === 'splitter') {
          grandparent.children = grandparent.children!.filter((c) => c.key !== parent.key);
        }
      }

      // If parent has only 1 child, collapse (replace parent with child)
      if (parent.children.length === 1 && parent.key !== 'root') {
        const grandparent = findParent(parent.key);
        if (grandparent && grandparent.type === 'splitter') {
          const index = grandparent.children!.findIndex((c) => c.key === parent.key);
          grandparent.children![index] = parent.children[0];
        }
      }
    }

    // Action: Update splitter sizes
    function updateSizes(splitterKey: string, sizes: number[]) {
      const splitter = findNode(splitterKey);
      if (splitter && splitter.type === 'splitter') {
        splitter.sizes = sizes;
      }
    }

    // Action: Change panel type
    function changePanelType(panelKey: string, newPanelKey: string) {
      const panel = findNode(panelKey);
      if (!panel || panel.type !== 'panel') return;

      // Check if the new key is already in use
      if (isPanelKeyInUse(newPanelKey)) {
        console.warn(`Panel type ${newPanelKey} is already in use`);
        return;
      }

      // Simply update the key
      panel.key = newPanelKey;
    }

    // Computed: Get all leaf panels (flatten tree)
    const allPanels = computed(() => {
      const panels: LayoutNode[] = [];
      function traverse(node: LayoutNode) {
        if (node.type === 'panel') {
          panels.push(node);
        } else if (node.type === 'splitter' && node.children) {
          node.children.forEach(traverse);
        }
      }
      traverse(root.value);
      return panels;
    });

    return {
      root,
      findNode,
      findParent,
      isPanelKeyInUse,
      getAvailablePanelTypes,
      splitPanel,
      closePanel,
      updateSizes,
      changePanelType,
      allPanels,
    };
  },
  {
    persist: true,
  }
);
