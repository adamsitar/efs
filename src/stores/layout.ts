import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface LayoutNode {
  id: string;
  type: 'panel' | 'stack';
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
    type: 'stack',
    direction: 'horizontal',
    children: [
      {
        id: 'panel-1',
        type: 'panel',
        component: 'FlightStripPanel',
        props: { title: 'Flight Strips' }
      },
      {
        id: 'panel-2',
        type: 'panel',
        component: 'WorkspacePanel',
        props: { title: 'Workspace' }
      },
      {
        id: 'panel-3',
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
    if (node.type === 'stack' && node.children) {
      for (const child of node.children) {
        const found = findNode(id, child);
        if (found) return found;
      }
    }
    return null;
  }

  // Helper: Find parent of node
  function findParent(id: string, node: LayoutNode = root.value): LayoutNode | null {
    if (node.type === 'stack' && node.children) {
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

  // Action: Split a panel
  function splitPanel(panelId: string, direction: 'horizontal' | 'vertical') {
    const panel = findNode(panelId);
    const parent = findParent(panelId);
    if (!panel || !parent || panel.type !== 'panel') return;

    // Create new panel
    const newPanel: LayoutNode = {
      id: `panel-${Date.now()}`,
      type: 'panel',
      component: panel.component,
      props: { title: `${panel.props?.title || 'Panel'} (Split)` }
    };

    // Create new stack containing [original panel, new panel]
    const newStack: LayoutNode = {
      id: `stack-${Date.now()}`,
      type: 'stack',
      direction,
      children: [panel, newPanel],
      sizes: [50, 50]
    };

    // Replace panel with stack in parent's children
    const index = parent.children!.findIndex(c => c.id === panelId);
    parent.children![index] = newStack;
  }

  // Action: Close a panel
  function closePanel(panelId: string) {
    const parent = findParent(panelId);
    if (!parent || parent.type !== 'stack') return;

    // Remove panel from parent
    parent.children = parent.children!.filter(c => c.id !== panelId);

    // If parent now empty, remove parent from grandparent
    if (parent.children.length === 0) {
      const grandparent = findParent(parent.id);
      if (grandparent && grandparent.type === 'stack') {
        grandparent.children = grandparent.children!.filter(c => c.id !== parent.id);
      }
    }

    // If parent has only 1 child, collapse (replace parent with child)
    if (parent.children.length === 1 && parent.id !== 'root') {
      const grandparent = findParent(parent.id);
      if (grandparent && grandparent.type === 'stack') {
        const index = grandparent.children!.findIndex(c => c.id === parent.id);
        grandparent.children![index] = parent.children[0];
      }
    }
  }

  // Action: Update splitter sizes
  function updateSizes(stackId: string, sizes: number[]) {
    const stack = findNode(stackId);
    if (stack && stack.type === 'stack') {
      stack.sizes = sizes;
    }
  }

  // Computed: Get all leaf panels (flatten tree)
  const allPanels = computed(() => {
    const panels: LayoutNode[] = [];
    function traverse(node: LayoutNode) {
      if (node.type === 'panel') {
        panels.push(node);
      } else if (node.type === 'stack' && node.children) {
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
    splitPanel,
    closePanel,
    updateSizes,
    allPanels
  };
});
