import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getModalComponent } from '@/registries/modalComponents';

// Persisted modal state (no component reference)
export interface PersistedModalState {
  key: string; // Unique identifier for this modal type (e.g., 'settings', 'flight-plan')
  title: string;
  props?: Record<string, any>;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

// Runtime modal instance (includes component)
export interface ModalInstance extends PersistedModalState {
  component: ReturnType<typeof getModalComponent>;
}

export const useModalsStore = defineStore(
  'modals',
  () => {
    const modals = ref<ModalInstance[]>([]);
    const nextZIndex = ref(1000);

    // Get modal by key
    function getModal(key: string): ModalInstance | undefined {
      return modals.value.find((m) => m.key === key);
    }

    // Open or restore modal (toggle behavior)
    function openModal(config: {
      key: string; // Unique key for this modal type
      title: string;
      props?: Record<string, any>;
      width?: number;
      height?: number;
      x?: number;
      y?: number;
    }): string {
      // Check if modal with this key already exists
      const existing = getModal(config.key);

      if (existing) {
        // If minimized, restore it
        if (existing.isMinimized) {
          existing.isMinimized = false;
        }
        // Bring to front
        bringToFront(config.key);
        return config.key;
      }

      // Get component from registry
      const component = getModalComponent(config.key);
      if (!component) {
        console.error(`Modal component not found in registry for key: ${config.key}`);
        return '';
      }

      // Create new modal with default or saved position/size
      const position = {
        x: config.x ?? window.innerWidth / 2 - (config.width ?? 400) / 2,
        y: config.y ?? window.innerHeight / 2 - (config.height ?? 300) / 2,
      };
      const size = {
        width: config.width ?? 400,
        height: config.height ?? 300,
      };

      const modal: ModalInstance = {
        key: config.key,
        title: config.title,
        component,
        props: config.props,
        isMinimized: false,
        position,
        size,
        zIndex: nextZIndex.value++,
      };

      modals.value.push(modal);
      return config.key;
    }

    // Close modal (destroy entirely)
    function closeModal(key: string) {
      const index = modals.value.findIndex((m) => m.key === key);
      if (index !== -1) {
        modals.value.splice(index, 1);
      }
    }

    // Toggle minimize state
    function toggleMinimize(key: string) {
      const modal = getModal(key);
      if (modal) {
        modal.isMinimized = !modal.isMinimized;
        if (!modal.isMinimized) {
          // Bring to front when restoring
          bringToFront(key);
        }
      }
    }

    // Bring modal to front
    function bringToFront(key: string) {
      const modal = getModal(key);
      if (modal) {
        modal.zIndex = nextZIndex.value++;
      }
    }

    // Update modal position (for drag)
    function updatePosition(key: string, position: { x: number; y: number }) {
      const modal = getModal(key);
      if (modal) {
        modal.position = position;
      }
    }

    // Update modal size
    function updateSize(key: string, size: { width: number; height: number }) {
      const modal = getModal(key);
      if (modal) {
        modal.size = size;
      }
    }

    // Get visible (non-minimized) modals
    const visibleModals = computed(() => modals.value.filter((m) => !m.isMinimized));

    // Get minimized modals (for taskbar)
    const minimizedModals = computed(() => modals.value.filter((m) => m.isMinimized));

    return {
      modals,
      visibleModals,
      minimizedModals,
      getModal,
      openModal,
      closeModal,
      toggleMinimize,
      bringToFront,
      updatePosition,
      updateSize,
    };
  },
  {
    persist: {
      pick: ['modals', 'nextZIndex'],
      serializer: {
        serialize: (state) => {
          // Serialize modals without component references
          const persistedModals: PersistedModalState[] = state.modals.map((m: ModalInstance) => ({
            key: m.key,
            title: m.title,
            props: m.props,
            isMinimized: m.isMinimized,
            position: m.position,
            size: m.size,
            zIndex: m.zIndex,
          }));
          return JSON.stringify({
            modals: persistedModals,
            nextZIndex: state.nextZIndex,
          });
        },
        deserialize: (value) => {
          const parsed = JSON.parse(value);
          // Restore modals with components from registry
          const restoredModals: ModalInstance[] = (parsed.modals || []).map(
            (m: PersistedModalState) => ({
              ...m,
              component: getModalComponent(m.key),
            })
          );
          return {
            modals: restoredModals,
            nextZIndex: parsed.nextZIndex || 1000,
          };
        },
      },
    },
  }
);
