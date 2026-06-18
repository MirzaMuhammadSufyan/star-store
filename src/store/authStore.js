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

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  initialize: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ isAuthenticated: true, user, loading: false });
      } else {
        set({ isAuthenticated: false, user: null, loading: false });
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

// Initialize the listener
useAuthStore.getState().initialize();
