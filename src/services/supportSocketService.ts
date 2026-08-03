import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from './url';

/**
 * Dedicated Socket.io singleton for the /support namespace.
 *
 * Emit events (Frontend → Server):
 *   join_session         { sessionUuid }                     → join session room
 *   admin_join_queue     {}                                  → subscribe to escalation queue
 *   admin_takeover_session { sessionUuid }                   → take over a session
 *   admin_message        { sessionUuid, content }            → send admin reply
 *   admin_resolve_session { sessionUuid, summary? }          → mark session resolved
 *   admin_return_to_bot  { sessionUuid }                     → return session to bot
 *
 * Listen events (Server → Frontend):
 *   new_message          SupportChatMessage                  → new chat message
 *   session_updated      { status, assignedAdminId? }        → session state change
 *   session_escalated    { sessionUuid, userId, reason }     → escalation alert (admin queue)
 */
class SupportSocketService {
  private socket: Socket | null = null;
  private namespace = '/support';
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    const userEntry = sessionStorage.getItem('user');
    const user = userEntry ? JSON.parse(userEntry) : null;
    const token = user?.accessToken;

    if (!token) {
      console.warn('⚠️ No auth token found for support socket connection');
      return;
    }

    console.log('🔌 Initializing support socket...');
    this.socket = io(`${SOCKET_URL}${this.namespace}`, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.onAny((event, ...args) => {
      console.log(`📡 [Support Socket: ${event}]`, args);
    });

    this.socket.on('connect', () => {
      console.log('✅ Support socket connected:', this.socket?.id);

      // Subscribe to the admin escalation queue room immediately on (re)connect
      this.socket?.emit('admin_join_queue', {});
      console.log('📋 [Support Socket] Subscribed to admin escalation queue');

      // Listen for the explicit 'joined' acknowledgement from the backend
      this.socket?.on('joined', (payload: any) => {
        console.log('✅ [Support Socket] Server acknowledged join:', payload);
      });

      // Re-attach all queued listeners on reconnect
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => {
          this.socket?.off(event, cb);
          this.socket?.on(event, cb);
        });
      });
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Support socket connection error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Support socket disconnected:', reason);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /** Join a specific support session room */
  joinSession(sessionUuid: string) {
    const emit = () => {
      this.socket?.emit('join_session', { sessionUuid });
      console.log(`✅ [Support Socket] Joined session room: support:session:${sessionUuid}`);
    };
    if (this.socket?.connected) {
      emit();
    } else {
      const waitJoin = () => {
        emit();
        this.off('connect', waitJoin);
      };
      this.on('connect', waitJoin);
    }
  }

  /** Leave a support session room */
  leaveSession(sessionUuid: string) {
    this.socket?.emit('leave_session', { sessionUuid });
    console.log(`👋 [Support Socket] Left session room: support:session:${sessionUuid}`);
  }

  /** Take over a session as a human admin */
  takeoverSession(sessionUuid: string) {
    this.socket?.emit('admin_takeover_session', { sessionUuid });
    console.log(`🤝 [Support Socket] Emitted admin_takeover_session for: ${sessionUuid}`);
  }

  /** Send an admin reply message via socket */
  sendAdminMessage(
    sessionUuid: string,
    content: string,
    callback?: (response: any) => void,
  ) {
    if (callback) {
      this.socket?.emit('admin_message', { sessionUuid, content }, callback);
    } else {
      this.socket?.emit('admin_message', { sessionUuid, content });
    }
  }

  /** Resolve a session */
  resolveSession(sessionUuid: string, summary?: string) {
    this.socket?.emit('admin_resolve_session', { sessionUuid, summary });
    console.log(`✅ [Support Socket] Emitted admin_resolve_session for: ${sessionUuid}`);
  }

  /** Return session to bot */
  returnToBot(sessionUuid: string) {
    this.socket?.emit('admin_return_to_bot', { sessionUuid });
    console.log(`🤖 [Support Socket] Emitted admin_return_to_bot for: ${sessionUuid}`);
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
    this.listeners.get(event)?.delete(callback);
    this.socket?.off(event, callback);
  }

  get isConnected() {
    return this.socket?.connected || false;
  }
}

export const supportSocketService = new SupportSocketService();
export default supportSocketService;
