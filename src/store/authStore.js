import { create } from 'zustand';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function resolveIsAdmin(user) {
  if (!user) return false;
  try {
    const token = await user.getIdTokenResult();
    if (token.claims.admin === true) return true;
  } catch (_) {}
  if (adminEmails.length > 0) {
    return adminEmails.includes((user.email || '').toLowerCase());
  }
  // No allowlist configured — permit any authenticated user in local dev only.
  return import.meta.env.DEV;
}

async function applyUser(user) {
  if (!user) {
    return { isAuthenticated: false, isAdmin: false, user: null, loading: false };
  }
  const isAdmin = await resolveIsAdmin(user);
  return { isAuthenticated: true, isAdmin, user, loading: false };
}

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  loading: true,

  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      set(await applyUser(user));
    });
  },

  login: async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const next = await applyUser(cred.user);
      set(next);
      return { success: true, isAdmin: next.isAdmin };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, isAdmin: false, error: error.message };
    }
  },

  sendPasswordlessLink: async (email) => {
    const actionCodeSettings = {
      url: window.location.origin + '/admin/login',
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      return { success: true };
    } catch (error) {
      console.error('Error sending email link:', error);
      return { success: false, error: error.message };
    }
  },

  completePasswordlessSignIn: async () => {
    if (!isSignInWithEmailLink(auth, window.location.href)) {
      return { success: false };
    }
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) {
      email = window.prompt('Please provide your email for confirmation');
    }
    try {
      const cred = await signInWithEmailLink(auth, email, window.location.href);
      window.localStorage.removeItem('emailForSignIn');
      const next = await applyUser(cred.user);
      set(next);
      return { success: true, isAdmin: next.isAdmin };
    } catch (error) {
      console.error('Error completing sign in:', error);
      return { success: false, isAdmin: false, error: error.message };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
}));

useAuthStore.getState().initialize();
