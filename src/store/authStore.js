import { create } from 'zustand';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth';

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

async function resolveIsAdmin(user) {
  if (!user) return false;
  try {
    const token = await user.getIdTokenResult();
    if (token.claims.admin === true) return true;
  } catch (_) {}
  return adminEmails.includes((user.email || '').toLowerCase());
}

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  loading: true,

  initialize: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await resolveIsAdmin(user);
        set({ isAuthenticated: true, isAdmin, user, loading: false });
      } else {
        set({ isAuthenticated: false, isAdmin: false, user: null, loading: false });
      }
    });
  },

  login: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
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
      console.error("Error sending email link:", error);
      return { success: false, error: error.message };
    }
  },

  completePasswordlessSignIn: async () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');
        return { success: true };
      } catch (error) {
        console.error("Error completing sign in:", error);
        return { success: false, error: error.message };
      }
    }
    return { success: false };
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));

useAuthStore.getState().initialize();
