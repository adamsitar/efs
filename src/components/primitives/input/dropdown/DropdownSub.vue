<script setup lang="ts">
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from 'reka-ui';
</script>

<template>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger
      class="px-2 py-1 cursor-pointer hover:bg-hover outline-none data-[highlighted]:bg-hover flex items-center justify-between"
    >
      <slot name="trigger" />
      <span class="i-ph-caret-right text-xs" />
    </DropdownMenuSubTrigger>

    <DropdownMenuPortal>
      <DropdownMenuSubContent
        :side-offset="4"
        class="min-w-36 bg-elevated border border-border-default p-1 text-sm text-primary z-50"
      >
        <slot />
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>
