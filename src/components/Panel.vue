<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Dropdown from '@/components/primitives/input/dropdown/Dropdown.vue';
import DropdownItem from '@/components/primitives/input/dropdown/DropdownItem.vue';
import DropdownSeparator from '@/components/primitives/input/dropdown/DropdownSeparator.vue';
import DropdownSub from '@/components/primitives/input/dropdown/DropdownSub.vue';
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
        <Dropdown>
          <template #trigger>
            <div
              class="i-ph-dots-three-vertical text-xs cursor-pointer text-primary hover:text-accent transition-colors"
            />
          </template>

          <DropdownItem @select="handleSplitHorizontal">
            {{ t('panels.splitHorizontal') }}
          </DropdownItem>
          <DropdownItem @select="handleSplitVertical">
            {{ t('panels.splitVertical') }}
          </DropdownItem>

          <DropdownSeparator />

          <DropdownSub>
            <template #trigger>
              {{ t('panels.changeType') }}
            </template>
            <DropdownItem
              v-for="panelType in availablePanelTypes"
              :key="panelType.key"
              :disabled="!panelType.isAvailable"
              @select="handleChangeType(panelType.key)"
            >
              {{ t(panelType.titleKey) }}
            </DropdownItem>
          </DropdownSub>
        </Dropdown>

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
