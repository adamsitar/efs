import { ref } from 'vue';
import type { StripArray } from '@/types/ws-messages';

export interface DragData {
  type: string;
  stripId: string;
  sourceArray: StripArray;
}

const currentDrag = ref<DragData | null>(null);

export function useDragState() {
  const setDragData = (data: DragData) => {
    currentDrag.value = data;
  };

  const clearDragData = () => {
    currentDrag.value = null;
  };

  return {
    currentDrag,
    setDragData,
    clearDragData,
  };
}
