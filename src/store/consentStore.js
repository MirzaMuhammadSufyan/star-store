import { create } from 'zustand';

const STORAGE_KEY = 'starstore_cookie_consent_v1';

const DEFAULT_PREFS = {
  necessary: true,
  analytics: false,
  advertising: false,
  affiliate: false,
};

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      decided: Boolean(parsed.decided),
      preferences: {
        ...DEFAULT_PREFS,
        ...(parsed.preferences || {}),
        necessary: true,
      },
      updatedAt: parsed.updatedAt || null,
    };
  } catch {
    return null;
  }
}

function persist(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        decided: state.decided,
        preferences: state.preferences,
        updatedAt: state.updatedAt,
      }),
    );
  } catch {
    /* private mode / quota */
  }
}

const stored = typeof window !== 'undefined' ? readStored() : null;

export const useConsentStore = create((set, get) => ({
  decided: stored?.decided ?? false,
  preferences: stored?.preferences ?? { ...DEFAULT_PREFS },
  updatedAt: stored?.updatedAt ?? null,
  bannerOpen: !(stored?.decided),
  manageOpen: false,

  openBanner: () => set({ bannerOpen: true }),
  openManage: () => set({ manageOpen: true, bannerOpen: true }),
  closeManage: () => set({ manageOpen: false }),

  setPreference: (key, value) => {
    if (key === 'necessary') return;
    set((s) => ({
      preferences: { ...s.preferences, [key]: Boolean(value) },
    }));
  },

  acceptAll: () => {
    const next = {
      decided: true,
      preferences: {
        necessary: true,
        analytics: true,
        advertising: true,
        affiliate: true,
      },
      updatedAt: new Date().toISOString(),
      bannerOpen: false,
      manageOpen: false,
    };
    persist(next);
    set(next);
  },

  rejectNonEssential: () => {
    const next = {
      decided: true,
      preferences: { ...DEFAULT_PREFS },
      updatedAt: new Date().toISOString(),
      bannerOpen: false,
      manageOpen: false,
    };
    persist(next);
    set(next);
  },

  savePreferences: () => {
    const { preferences } = get();
    const next = {
      decided: true,
      preferences: { ...preferences, necessary: true },
      updatedAt: new Date().toISOString(),
      bannerOpen: false,
      manageOpen: false,
    };
    persist(next);
    set(next);
  },

  /** True when a category is allowed (after a decision). */
  allows: (category) => {
    const { decided, preferences } = get();
    if (category === 'necessary') return true;
    if (!decided) return false;
    return Boolean(preferences[category]);
  },
}));
