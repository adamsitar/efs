import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { generateId } from '@/utils/id';

export interface LayoutNode {
  id: string;
  type: 'panel' | 'splitter' | 'group';
  component?: string;
  props?: Record<string, any>;
  direction?: 'horizontal' | 'vertical';
  children?: LayoutNode[];
  sizes?: number[];
}

export const useLayoutStore = defineStore('layout', () => {
  // Root layout node
  const root = ref<LayoutNode>({
    id: 'root',
    type: 'splitter',
    direction: 'horizontal',
    children: [
      {
        id: generateId('panel'),
        type: 'panel',
        component: 'FlightStripPanel',
        props: { title: 'Flight Strips' }
      },
      {
        id: generateId('panel'),
        type: 'panel',
        component: 'WorkspacePanel',
        props: { title: 'Workspace' }
      },
      {
        id: generateId('panel'),
        type: 'panel',
        component: 'InspectorPanel',
        props: { title: 'Inspector' }
      }
    ],
    sizes: [30, 40, 30]
  });

  // Helper: Find node by ID (recursive search)
  function findNode(id: string, node: LayoutNode = root.value): LayoutNode | null {
    if (node.id === id) return node;
    if (node.type === 'splitter' && node.children) {
      for (const child of node.children) {
        const found = findNode(id, child);
        if (found) return found;
      }
    }
    return null;
  }

  // Helper: Find parent of node
  function findParent(id: string, node: LayoutNode = root.value): LayoutNode | null {
    if (node.type === 'splitter' && node.children) {
      if (node.children.some(child => child.id === id)) {
        return node;
      }
      for (const child of node.children) {
        const found = findParent(id, child);
        if (found) return found;
      }
    }
    return null;
  }

  // Helper: Find first panel in a layout node (recursive)
  function findFirstPanelInNode(node: LayoutNode): LayoutNode | null {
    if (node.type === 'panel') return node
    if (node.type === 'splitter' && node.children && node.children.length > 0) {
      return findFirstPanelInNode(node.children[0])
    }
    return null
  }

  // Find next panel that should be focused after closing a panel
  function findNextFocusablePanel(panelId: string): string | null {
    const parent = findParent(panelId)
    if (!parent || !parent.children) return null

    const siblings = parent.children
    const currentIndex = siblings.findIndex(c => c.id === panelId)
    if (currentIndex === -1) return null

    // Try next siblings first
    for (let i = currentIndex + 1; i < siblings.length; i++) {
      const panel = findFirstPanelInNode(siblings[i])
      if (panel) return panel.id
    }

    // If no next, try previous siblings
    for (let i = currentIndex - 1; i >= 0; i--) {
      const panel = findFirstPanelInNode(siblings[i])
      if (panel) return panel.id
    }

    return null
  }

  // Action: Split a panel
  function splitPanel(panelId: string, direction: 'horizontal' | 'vertical') {
    const panel = findNode(panelId);
    const parent = findParent(panelId);
    if (!panel || !parent || panel.type !== 'panel') return;

    // Create new panel with UUID
    const newPanel: LayoutNode = {
      id: generateId('panel'),
      type: 'panel',
      component: panel.component,
      props: { title: `${panel.props?.title || 'Panel'} (Split)` }
    };

    // Create new splitter with UUID
    const newSplitter: LayoutNode = {
      id: generateId('splitter'),
      type: 'splitter',
      direction,
      children: [panel, newPanel],
      sizes: [50, 50]
    };

    // Replace panel with splitter in parent's children
    const index = parent.children!.findIndex(c => c.id === panelId);
    parent.children![index] = newSplitter;
  }

  // Action: Close a panel
  function closePanel(panelId: string): string | null {
    // Find next panel to focus BEFORE closing
    const nextPanelId = findNextFocusablePanel(panelId)

    const parent = findParent(panelId);
    if (!parent || parent.type !== 'splitter') return null;

    // Remove panel from parent
    parent.children = parent.children!.filter(c => c.id !== panelId);

    // If parent now empty, remove parent from grandparent
    if (parent.children.length === 0) {
      const grandparent = findParent(parent.id);
      if (grandparent && grandparent.type === 'splitter') {
        grandparent.children = grandparent.children!.filter(c => c.id !== parent.id);
      }
    }

    // If parent has only 1 child, collapse (replace parent with child)
    if (parent.children.length === 1 && parent.id !== 'root') {
      const grandparent = findParent(parent.id);
      if (grandparent && grandparent.type === 'splitter') {
        const index = grandparent.children!.findIndex(c => c.id === parent.id);
        grandparent.children![index] = parent.children[0];
      }
    }

    // Return next panel ID for caller to focus
    return nextPanelId
  }

  // Action: Update splitter sizes
  function updateSizes(splitterId: string, sizes: number[]) {
    const splitter = findNode(splitterId);
    if (splitter && splitter.type === 'splitter') {
      splitter.sizes = sizes;
    }
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
    findFirstPanelInNode,
    findNextFocusablePanel,
    splitPanel,
    closePanel,
    updateSizes,
    allPanels
  };
});
