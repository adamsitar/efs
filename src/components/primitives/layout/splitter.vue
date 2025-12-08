<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import Group from '@/components/Group.vue'
import type { LayoutNode } from '@/stores/layout'

withDefaults(defineProps<{
  node: LayoutNode
  isRoot?: boolean
}>(), {
  isRoot: false
})

// Component registry for dynamic rendering
const componentMap: Record<string, any> = {
  FlightStripPanel: defineAsyncComponent(() => import('@/components/panels/FlightStripPanel.vue')),
  WorkspacePanel: defineAsyncComponent(() => import('@/components/panels/WorkspacePanel.vue')),
  InspectorPanel: defineAsyncComponent(() => import('@/components/panels/InspectorPanel.vue'))
}

function getComponent(name: string) {
  return componentMap[name]
}
</script>

<template>
  <!-- Splitter with 2+ children: wrap in Group and render with splitters -->
  <Group
    v-if="node.type === 'splitter' && node.children && node.children.length >= 2"
    :group-id="`${node.id}-group`"
    :direction="node.direction || 'horizontal'"
    :is-root="isRoot"
  >
    <SplitterGroup :direction="node.direction || 'horizontal'" class="h-full w-full">
      <template v-for="(child, index) in node.children" :key="child.id">
        <SplitterPanel :default-size="node.sizes?.[index] || 50" :min-size="15">
          <!-- Recursive: if child is splitter, render splitter; if panel, render component -->
          <splitter v-if="child.type === 'splitter'" :node="child" />
          <component
            v-else-if="child.type === 'panel' && child.component"
            :is="getComponent(child.component)"
            v-bind="{ ...child.props, panelId: child.id }"
          />
        </SplitterPanel>

        <!-- Resize handle between panels (invisible but panels have borders) -->
        <SplitterResizeHandle
          v-if="index < node.children.length - 1"
          :class="[
            node.direction === 'horizontal' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize',
            'bg-transparent hover:bg-border-subtle transition-colors'
          ]"
        />
      </template>
    </SplitterGroup>
  </Group>

  <!-- Splitter with 1 child: collapse (render child without wrapper) -->
  <splitter
    v-else-if="node.type === 'splitter' && node.children && node.children.length === 1"
    :node="node.children[0]"
  />

  <!-- Single panel: render component -->
  <component
    v-else-if="node.type === 'panel' && node.component"
    :is="getComponent(node.component)"
    v-bind="{ ...node.props, panelId: node.id }"
  />

  <!-- Empty splitter: render nothing (auto-cleanup) -->
  <div v-else class="h-full w-full bg-base" />
</template>
