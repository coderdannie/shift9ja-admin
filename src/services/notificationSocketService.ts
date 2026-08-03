import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './url';

class NotificationSocketService {
  private socket: Socket | null = null;
  private namespace = '/notifications';
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    const userEntry = sessionStorage.getItem('user');
    const user = userEntry ? JSON.parse(userEntry) : null;
    const token = user?.accessToken;

    if (!token) {
      console.warn('No auth token found for notifications socket connection');
      return;
    }

    console.log(`🔌 Initializing admin notifications socket...`);
    this.socket = io(`${SOCKET_URL}${this.namespace}`, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("✅ Notifications socket connected:", this.socket?.id);
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => {
          this.socket?.off(event, cb);
          this.socket?.on(event, cb);
        });
      });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Notifications socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Notifications socket disconnected:', reason);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback: (...args: any[]) => void) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
    this.socket?.off(event, callback);
  }

  get isConnected() {
    return this.socket?.connected || false;
  }
}

export const notificationSocketService = new NotificationSocketService();
export default notificationSocketService;
