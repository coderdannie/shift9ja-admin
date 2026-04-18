import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './url';

class SocketService {
  private socket: Socket | null = null;
  private namespace = '/chat';
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    const userEntry = sessionStorage.getItem('user');
    const user = userEntry ? JSON.parse(userEntry) : null;
    const token = user?.accessToken;

    if (!token) {
      console.warn('No auth token found for socket connection');
      return;
    }

    console.log(`🔌 Initializing admin chat socket...`);
    this.socket = io(`${SOCKET_URL}${this.namespace}`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    // Debug: Listen to ALL events
    this.socket.onAny((event, ...args) => {
      console.log(`📡 [Socket Event: ${event}]`, args);
    });

    this.socket.on("connect", () => {
      console.log("✅ Chat socket connected:", this.socket?.id);
      // Re-attach all queued listeners on new socket
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => {
          this.socket?.off(event, cb);
          this.socket?.on(event, cb);
        });
      });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Chat socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Chat socket disconnected:', reason);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(conversationUuid: string) {
    if (!this.socket?.connected) {
      const waitJoin = () => {
        this.socket?.emit("joinRoom", { conversationUuid });
        this.off("connect", waitJoin);
      };
      this.on("connect", waitJoin);
      return;
    }
    this.socket.emit("joinRoom", { conversationUuid });
  }

  sendMessage(payload: {
    conversationUuid: string;
    content: string;
    type?: 'text' | 'image';
    tempId?: string;
  }) {
    this.socket?.emit('sendMessage', {
      ...payload,
      type: payload.type || 'text',
    });
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
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

export const socketService = new SocketService();
export default socketService;
