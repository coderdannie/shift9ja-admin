import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, type Messaging } from 'firebase/messaging';

// ─── Firebase Project Config (populated from environment variables) ────────────
// All VITE_FIREBASE_* values must be set in your .env.production and netlify.toml
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// ─── Singleton app initialization ─────────────────────────────────────────────
// Avoids "Firebase App named '[DEFAULT]' already exists" errors in hot-reload.
let firebaseApp: FirebaseApp;
if (getApps().length === 0) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

export { firebaseApp };

// ─── Safe Messaging accessor ───────────────────────────────────────────────────
// FCM is browser-only; guard against SSR or unsupported environments.
export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;
  try {
    return getMessaging(firebaseApp);
  } catch {
    return null;
  }
}
