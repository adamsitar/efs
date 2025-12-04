<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';
import type { LayoutNode } from '@/stores/layout';

defineProps<{
  node: LayoutNode;
}>();

// Component registry for dynamic rendering
const componentMap: Record<string, any> = {
  FlightStripPanel: defineAsyncComponent(() => import('@/components/panels/FlightStripPanel.vue')),
  WorkspacePanel: defineAsyncComponent(() => import('@/components/panels/WorkspacePanel.vue')),
  InspectorPanel: defineAsyncComponent(() => import('@/components/panels/InspectorPanel.vue')),
};

function getComponent(name: string) {
  return componentMap[name];
}
</script>

<template>
  <!-- Stack with 2+ children: render with splitters -->
  <SplitterGroup v-if="node.type === 'stack' && node.children && node.children.length >= 2"
    :direction="node.direction || 'horizontal'" class="h-full w-full">
    <template v-for="(child, index) in node.children" :key="child.id">
      <SplitterPanel :default-size="node.sizes?.[index] || 50" :min-size="15">
        <!-- Recursive: if child is stack, render Stack; if panel, render component -->
        <Stack v-if="child.type === 'stack'" :node="child" />
        <component v-else-if="child.type === 'panel' && child.component" :is="getComponent(child.component)"
          v-bind="{ ...child.props, panelId: child.id }" />
      </SplitterPanel>

      <!-- Resize handle between panels (invisible but panels have borders) -->
      <SplitterResizeHandle v-if="index < node.children.length - 1"
        class="w-1 bg-transparent cursor-col-resize hover:bg-border-subtle transition-colors" />
    </template>
  </SplitterGroup>

  <!-- Stack with 1 child: collapse (render child without wrapper) -->
  <Stack v-else-if="node.type === 'stack' && node.children && node.children.length === 1" :node="node.children[0]" />

  <!-- Single panel: render component -->
  <component v-else-if="node.type === 'panel' && node.component" :is="getComponent(node.component)"
    v-bind="{ ...node.props, panelId: node.id }" />

  <!-- Empty stack: render nothing (auto-cleanup) -->
  <div v-else class="h-full w-full bg-base" />
</template>
