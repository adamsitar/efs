<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from 'reka-ui';
import { useLayoutStore } from '@/stores/layout';
import { getPanelContent } from '@/registries/panelContent';

interface Props {
  panelKey: string;
  closable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
});

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();
const layoutStore = useLayoutStore();

// Get panel metadata from registry
const panelMeta = computed(() => getPanelContent(props.panelKey));
const title = computed(() => (panelMeta.value ? t(panelMeta.value.titleKey) : 'Unknown Panel'));
const contentComponent = computed(() => panelMeta.value?.component);

// Get available panel types with availability status
const availablePanelTypes = computed(() => layoutStore.getAvailablePanelTypes());

function handleSplitHorizontal() {
  layoutStore.splitPanel(props.panelKey, 'horizontal');
}

function handleSplitVertical() {
  layoutStore.splitPanel(props.panelKey, 'vertical');
}

function handleChangeType(newPanelKey: string) {
  layoutStore.changePanelType(props.panelKey, newPanelKey);
}
</script>

<template>
  <div
    :data-panel-key="panelKey"
    class="h-full flex flex-col border border-border-default rounded-xs bg-panel"
  >
    <!-- Heading bar -->
    <div class="flex items-center justify-between px-2 py-1 border-b border-default min-h-7">
      <div class="text-sm text-primary">
        {{ title }}
      </div>

      <!-- Panel controls -->
      <div class="flex items-center gap-1">
        <!-- Settings menu -->
        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <div
              class="i-ph-dots-three-vertical text-xs cursor-pointer text-primary hover:text-accent transition-colors"
            />
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent
              :side-offset="4"
              class="min-w-40 bg-elevated border border-border-default p-1 text-sm text-primary z-50"
            >
              <DropdownMenuItem
                class="px-2 py-1 cursor-pointer hover:bg-hover outline-none data-[highlighted]:bg-hover"
                @select="handleSplitHorizontal"
              >
                {{ t('panels.splitHorizontal') }}
              </DropdownMenuItem>
              <DropdownMenuItem
                class="px-2 py-1 cursor-pointer hover:bg-hover outline-none data-[highlighted]:bg-hover"
                @select="handleSplitVertical"
              >
                {{ t('panels.splitVertical') }}
              </DropdownMenuItem>

              <DropdownMenuSeparator class="h-px bg-border-default my-1" />

              <DropdownMenuSub>
                <DropdownMenuSubTrigger
                  class="px-2 py-1 cursor-pointer hover:bg-hover outline-none data-[highlighted]:bg-hover flex items-center justify-between"
                >
                  {{ t('panels.changeType') }}
                  <span class="i-ph-caret-right text-xs" />
                </DropdownMenuSubTrigger>

                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    :side-offset="4"
                    class="min-w-36 bg-elevated border border-border-default p-1 text-sm text-primary z-50"
                  >
                    <DropdownMenuItem
                      v-for="panelType in availablePanelTypes"
                      :key="panelType.key"
                      :disabled="!panelType.isAvailable"
                      class="px-2 py-1 cursor-pointer hover:bg-hover outline-none data-[highlighted]:bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                      @select="handleChangeType(panelType.key)"
                    >
                      {{ t(panelType.titleKey) }}
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenuRoot>

        <!-- Close button -->
        <div
          v-if="closable"
          class="i-ph-x text-xs cursor-pointer text-primary hover:text-accent transition-colors"
          @click="emit('close')"
        />
      </div>
    </div>

    <!-- Content area -->
    <div class="flex-1 overflow-auto p-2">
      <component v-if="contentComponent" :is="contentComponent" :panel-key="panelKey" />
      <div v-else class="text-secondary">Unknown panel type: {{ panelKey }}</div>
    </div>
  </div>
</template>
