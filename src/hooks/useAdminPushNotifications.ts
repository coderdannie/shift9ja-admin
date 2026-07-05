import { useEffect, useRef, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import toast from 'react-hot-toast';
import { getFirebaseMessaging } from '../services/firebaseService';
import { registerFcmToken, unregisterFcmToken } from '../services/api/notifications';
import {
  Bell,
  ShieldAlert,
  AlertCircle,
  MessageSquare,
  MapPin,
  DollarSign,
  Info,
} from 'lucide-react';
import { createElement } from 'react';

// Lucide icons mapped to notification types for foreground toasts
const TYPE_ICONS: Record<string, any> = {
  SOS_ALERT: ShieldAlert,
  DEVIATION_ALERT: MapPin,
  NEW_DISPUTE: AlertCircle,
  NEW_SUPPORT_CHAT: MessageSquare,
  LARGE_TRANSACTION: DollarSign,
  SYSTEM_ALERT: Info,
};

const TYPE_COLORS: Record<string, string> = {
  SOS_ALERT: '#e11d48',
  DEVIATION_ALERT: '#d97706',
  NEW_DISPUTE: '#ea580c',
  NEW_SUPPORT_CHAT: '#4f46e5',
  LARGE_TRANSACTION: '#059669',
  SYSTEM_ALERT: '#2563eb',
};

/**
 * useAdminPushNotifications
 *
 * Manages the full FCM Web Push lifecycle for the admin dashboard:
 *  1. Requests browser notification permission
 *  2. Generates an FCM token (using VAPID key) and registers it with the backend
 *  3. Listens for foreground FCM messages and shows react-hot-toast banners
 *  4. On unmount (logout/navigation), unregisters the token from the backend
 *
 * @param isAuthenticated - Only activate when an admin JWT session is active
 */
export function useAdminPushNotifications(isAuthenticated: boolean) {
  const fcmTokenRef = useRef<string | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ── Unregister token (cleanup on logout) ──────────────────────────────────
  const cleanupToken = useCallback(async () => {
    if (fcmTokenRef.current) {
      try {
        await unregisterFcmToken(fcmTokenRef.current);
      } catch {
        // Silent — best-effort cleanup
      }
      fcmTokenRef.current = null;
    }
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const setup = async () => {
      // ── 1. Request browser notification permission ───────────────────────
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('[FCM] Notification permission denied by user.');
        return;
      }

      // ── 2. Get the Firebase Messaging instance ───────────────────────────
      const messaging = getFirebaseMessaging();
      if (!messaging) {
        console.warn('[FCM] Firebase Messaging is not available in this environment.');
        return;
      }

      // ── 3. Register service worker ───────────────────────────────────────
      let swRegistration: ServiceWorkerRegistration | undefined;
      try {
        swRegistration = await navigator.serviceWorker.register(
          '/firebase-messaging-sw.js',
          { scope: '/' }
        );
      } catch (err) {
        console.error('[FCM] Service worker registration failed:', err);
        return;
      }

      // ── 4. Generate FCM token ────────────────────────────────────────────
      let fcmToken: string | null = null;
      try {
        fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: swRegistration,
        });
      } catch (err) {
        console.error('[FCM] Failed to get FCM token:', err);
        return;
      }

      if (!fcmToken || cancelled) return;

      fcmTokenRef.current = fcmToken;

      // ── 5. Register token with Shift9ja backend ──────────────────────────
      try {
        await registerFcmToken({
          token: fcmToken,
          platform: 'web',
          deviceId: navigator.userAgent.slice(0, 255),
        });
        console.log('[FCM] Token registered with backend ✅');
      } catch (err) {
        console.error('[FCM] Failed to register token with backend:', err);
        return;
      }

      // ── 6. Listen for foreground messages ────────────────────────────────
      // (Background messages are handled by the service worker)
      const unsubscribe = onMessage(messaging, (payload) => {
        const title = payload.notification?.title || 'Shift9ja Admin Alert';
        const body = payload.notification?.body || 'You have a new notification.';
        const type = (payload.data?.type as string)?.toUpperCase() || 'SYSTEM_ALERT';

        const Icon = TYPE_ICONS[type] || Bell;
        const color = TYPE_COLORS[type] || '#374151';

        toast.custom(
          (t) =>
            createElement(
              'div',
              {
                className: `flex items-start gap-3 bg-white shadow-xl rounded-2xl px-4 py-3.5 border border-gray-100 max-w-sm w-full transition-all ${
                  t.visible ? 'animate-enter' : 'animate-leave'
                }`,
                style: { minWidth: 300 },
              },
              // Icon badge
              createElement(
                'div',
                {
                  style: {
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  },
                },
                createElement(Icon, { size: 18, color })
              ),
              // Text content
              createElement(
                'div',
                { style: { flex: 1 } },
                createElement(
                  'p',
                  {
                    style: {
                      fontWeight: 800,
                      fontSize: 12,
                      color: '#101828',
                      marginBottom: 2,
                    },
                  },
                  title
                ),
                createElement(
                  'p',
                  {
                    style: {
                      fontWeight: 500,
                      fontSize: 11,
                      color: '#667085',
                      lineHeight: 1.5,
                    },
                  },
                  body
                )
              )
            ),
          {
            duration: 6000,
            position: 'top-right',
          }
        );
      });

      unsubscribeRef.current = unsubscribe;
    };

    setup();

    return () => {
      cancelled = true;
      // NOTE: We intentionally do NOT unregister on component re-render.
      // Token cleanup should happen explicitly on logout via cleanupToken().
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [isAuthenticated]);

  return { cleanupToken };
}
