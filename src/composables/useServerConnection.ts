import { useWebSocket } from '@vueuse/core';
import { computed } from 'vue';

// Development: connect directly to backend on localhost:3001
// Docker/Production: use /ws path (nginx proxies to backend container)
const WS_URL =
  import.meta.env.MODE === 'development'
    ? 'ws://127.0.0.1:3001'
    : `ws://${window.location.host}/ws`;

// Singleton — created once when module is first imported
const { status, data, send, open, close } = useWebSocket(WS_URL, {
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      console.error('Failed to connect after 3 retries');
    },
  },
  heartbeat: {
    message: 'ping',
    interval: 30000,
    pongTimeout: 5000,
  },
});

const isConnected = computed(() => status.value === 'OPEN');
const isConnecting = computed(() => status.value === 'CONNECTING');

export function useServerConnection() {
  return {
    status,
    data,
    send,
    open,
    close,
    isConnected,
    isConnecting,
  };
}
