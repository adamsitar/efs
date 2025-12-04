<script setup lang="ts">
import Group from '@/components/Group.vue';
import Stack from '@/components/Stack.vue';
import { useLayoutStore } from '@/stores/layout';

const layoutStore = useLayoutStore();
</script>

<template>
  <div class="h-screen w-screen bg-base">
    <Group>
      <Stack :node="layoutStore.root" />
    </Group>
  </div>
</template>
