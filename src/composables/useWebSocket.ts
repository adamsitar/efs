import { watch } from 'vue';
import { useServerConnection } from './useServerConnection';
import { useStripsStore } from '@/stores/strips';
import type { ServerMessage, StripOperation } from '@/types/ws-messages';

/**
 * WebSocket composable for receiving and processing strip messages
 * Connects to the backend WebSocket server and handles incoming messages
 */
export function useWebSocket() {
  const { status, data, isConnected, isConnecting } = useServerConnection();
  const stripsStore = useStripsStore();

  // Watch for incoming messages and process them
  watch(data, (rawMessage) => {
    if (!rawMessage) return;

    try {
      const message: ServerMessage = JSON.parse(rawMessage);
      processMessage(message);
      logMessage(message);
    } catch (error) {
      console.error('[WebSocket] Failed to parse message:', error);
      console.error('[WebSocket] Raw message:', rawMessage);
    }
  });

  /**
   * Process incoming messages and update the strips store
   */
  function processMessage(message: ServerMessage) {
    if (message.type === 'FullStateSync') {
      stripsStore.handleFullStateSync(message.strips);
    } else if (message.type === 'StripOperation') {
      processStripOperation(message.operation);
    }
  }

  /**
   * Process strip operations and dispatch to appropriate store actions
   */
  function processStripOperation(operation: StripOperation) {
    switch (operation.type) {
      case 'Create':
        stripsStore.handleCreate(operation.target_array, operation.strip);
        break;

      case 'Update':
        stripsStore.handleUpdate(operation.strip_id, operation.changes);
        break;

      case 'Delete':
        stripsStore.handleDelete(operation.strip_id);
        break;

      case 'Move':
        stripsStore.handleMove(operation.strip_id, operation.from, operation.to);
        break;
    }
  }

  return {
    status,
    isConnected,
    isConnecting,
  };
}

/**
 * Logs incoming messages with structured formatting
 */
function logMessage(message: ServerMessage) {
  if (message.type === 'FullStateSync') {
    console.info('[WebSocket] FullStateSync received:', {
      planned: message.strips.planned.length,
      departed: message.strips.departed.length,
      arrived: message.strips.arrived.length,
      cancelled: message.strips.cancelled.length,
    });
    console.log('[WebSocket] Full state:', message.strips);
  } else if (message.type === 'StripOperation') {
    logStripOperation(message.operation);
  }
}

/**
 * Logs strip operations with detailed information
 */
function logStripOperation(operation: StripOperation) {
  switch (operation.type) {
    case 'Create':
      console.info('[WebSocket] StripOperation - Create:', {
        targetArray: operation.target_array,
        callsign: operation.strip.callsign,
        stripId: operation.strip.id,
      });
      console.log('[WebSocket] Created strip:', operation.strip);
      break;

    case 'Update':
      console.info('[WebSocket] StripOperation - Update:', {
        stripId: operation.strip_id,
        changes: operation.changes,
      });
      break;

    case 'Delete':
      console.info('[WebSocket] StripOperation - Delete:', {
        stripId: operation.strip_id,
      });
      break;

    case 'Move':
      console.info('[WebSocket] StripOperation - Move:', {
        stripId: operation.strip_id,
        from: operation.from,
        to: operation.to,
      });
      break;
  }
}
