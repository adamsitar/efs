<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui';

interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>

<template>
  <DropdownMenuItem
    :disabled="disabled"
    class="px-2 py-1 cursor-pointer hover:bg-hover outline-none data-[highlighted]:bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
  >
    <slot />
  </DropdownMenuItem>
</template>
