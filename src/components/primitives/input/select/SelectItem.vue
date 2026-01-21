<script setup lang="ts">
import { SelectItem, SelectItemText } from 'reka-ui';

interface Props {
  value: string;
}

const props = defineProps<Props>();
</script>

<template>
  <SelectItem
    :value="value"
    class="px-2 py-1 text-sm text-primary hover:bg-elevated cursor-pointer outline-none font-mono"
  >
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
