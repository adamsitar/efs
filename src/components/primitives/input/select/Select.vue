<script setup lang="ts">
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectPortal,
  SelectViewport,
} from 'reka-ui';

interface Props {
  modelValue?: string;
  placeholder?: string;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <SelectRoot :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <SelectTrigger
      class="w-full px-2 py-1 bg-base border border-border-default text-primary text-sm outline-none focus:border-accent font-mono flex items-center justify-between"
    >
      <SelectValue :placeholder="placeholder" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        class="bg-panel border border-border-default shadow-lg overflow-hidden"
        :side-offset="5"
      >
        <SelectViewport>
          <slot />
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
