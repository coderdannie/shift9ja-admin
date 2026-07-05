// firebase-messaging-sw.js
// Place this file in the public/ directory so it is served at the root domain.
// The browser requires it at: https://your-admin-domain.com/firebase-messaging-sw.js

// ─── Step 1: Import Firebase compat scripts ───────────────────────────────────
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// ─── Step 2: Initialize Firebase with your PUBLIC project config ──────────────
// NOTE: These values are intentionally public-facing (they go in the browser).
// Replace each placeholder with your actual Firebase project values.
firebase.initializeApp({
  apiKey: "REPLACE_WITH_VITE_FIREBASE_API_KEY",
  authDomain: "REPLACE_WITH_VITE_FIREBASE_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_VITE_FIREBASE_PROJECT_ID",
  messagingSenderId: "REPLACE_WITH_VITE_FIREBASE_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_VITE_FIREBASE_APP_ID",
});

const messaging = firebase.messaging();

// ─── Step 3: Handle background messages ───────────────────────────────────────
// This fires when the browser tab is closed or the app is in the background.
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Shift9ja Admin Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new administrative notification.',
    icon: '/logo.png', // Ensure /public/logo.png exists
    badge: '/badge.png',
    data: payload.data || {},
    requireInteraction: true, // Keeps the notification visible until dismissed
    tag: payload.data?.type || 'shift9ja-admin', // Deduplicates same-type notifications
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ─── Step 4: Handle notification click (redirect admin to the correct page) ────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  let targetUrl = '/dashboard';

  // Route to the correct admin section based on notification type
  if (data.type === 'SOS_ALERT') {
    targetUrl = '/sos-alerts';
  } else if (data.type === 'NEW_DISPUTE') {
    targetUrl = data.disputeUuid
      ? `/dispute-reports/${data.disputeUuid}`
      : '/dispute-reports';
  } else if (data.type === 'DEVIATION_ALERT') {
    const taskId = data.taskId || data.taskUuid;
    targetUrl = taskId ? `/task-management/${taskId}` : '/task-management';
  } else if (data.type === 'NEW_SUPPORT_CHAT') {
    targetUrl = data.chatUuid
      ? `/admin-chats/${data.chatUuid}`
      : '/admin-chats';
  } else if (data.url) {
    targetUrl = data.url;
  }

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, navigate it instead of opening a new one
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        // Otherwise open a fresh tab
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
