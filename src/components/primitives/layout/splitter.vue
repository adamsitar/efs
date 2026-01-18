<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui';
import { useLayoutStore } from '@/stores/layout';
import Panel from '@/components/Panel.vue';
import type { LayoutNode } from '@/stores/layout';

const props = defineProps<{
  node: LayoutNode;
}>();

const layoutStore = useLayoutStore();

function handleLayoutChange(sizes: number[]) {
  if (props.node.key) {
    layoutStore.updateSizes(props.node.key, sizes);
  }
}

function handlePanelClose(panelKey: string) {
  layoutStore.closePanel(panelKey);
}
</script>

<template>
  <!-- Splitter with 2+ children: render with splitters -->
  <SplitterGroup
    v-if="node.type === 'splitter' && node.children && node.children.length >= 2"
    :direction="node.direction || 'horizontal'"
    class="h-full w-full"
    @layout="handleLayoutChange"
  >
    <template v-for="(child, index) in node.children" :key="child.key">
      <SplitterPanel :default-size="node.sizes?.[index] || 50" :min-size="15">
        <!-- Recursive: if child is splitter, render splitter; if panel, render Panel -->
        <splitter v-if="child.type === 'splitter'" :node="child" />
        <Panel
          v-else-if="child.type === 'panel'"
          :panel-key="child.key"
          @close="handlePanelClose(child.key)"
        />
      </SplitterPanel>

      <!-- Resize handle between panels (invisible but panels have borders) -->
      <SplitterResizeHandle
        v-if="index < node.children.length - 1"
        :class="[
          node.direction === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize',
          'bg-transparent hover:bg-border-subtle transition-colors',
        ]"
      />
    </template>
  </SplitterGroup>

  <!-- Splitter with 1 child: collapse (render child without wrapper) -->
  <splitter
    v-else-if="node.type === 'splitter' && node.children && node.children.length === 1"
    :node="node.children[0]"
  />

  <!-- Single panel: render Panel component -->
  <Panel
    v-else-if="node.type === 'panel'"
    :panel-key="node.key"
    @close="handlePanelClose(node.key)"
  />

  <!-- Empty splitter: render nothing (auto-cleanup) -->
  <div v-else class="h-full w-full bg-base" />
</template>
