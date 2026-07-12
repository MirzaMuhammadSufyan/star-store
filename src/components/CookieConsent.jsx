import { Link } from 'react-router-dom';
import { Cookie, Settings2, X } from 'lucide-react';
import { useConsentStore } from '../store/consentStore';

const TOGGLES = [
  {
    key: 'necessary',
    label: 'Necessary',
    desc: 'Required for core features (consent memory, favourites). Always on.',
    locked: true,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    desc: 'Helps us measure product-click performance and improve the storefront.',
  },
  {
    key: 'advertising',
    label: 'Advertising',
    desc: 'Allows Google AdSense and partners to serve and measure ads.',
  },
  {
    key: 'affiliate',
    label: 'Affiliate attribution',
    desc: 'Lets partner stores attribute purchases when you click Buy links.',
  },
];

function Toggle({ on, locked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={locked}
      onClick={() => !locked && onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        on ? 'bg-amber-500' : 'bg-slate-300'
      } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function CookieConsent() {
  const {
    bannerOpen,
    manageOpen,
    preferences,
    acceptAll,
    rejectNonEssential,
    savePreferences,
    setPreference,
    openManage,
    closeManage,
  } = useConsentStore();

  if (!bannerOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4 pointer-events-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-consent-title"
        className="pointer-events-auto mx-auto max-w-3xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
            <Cookie size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="cookie-consent-title" className="text-sm font-semibold text-slate-900 sm:text-base">
              Cookie preferences
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
              We use cookies for essential site features and, with your permission, analytics,
              advertising, and affiliate attribution. See our{' '}
              <Link to="/legal/cookies" className="font-medium text-amber-700 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          </div>
          {manageOpen && (
            <button
              type="button"
              onClick={closeManage}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              aria-label="Close cookie settings"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {manageOpen && (
          <div className="space-y-3 border-b border-slate-100 px-4 py-4 sm:px-5">
            {TOGGLES.map((item) => (
              <div
                key={item.key}
                className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{item.desc}</p>
                </div>
                <Toggle
                  label={item.label}
                  on={Boolean(preferences[item.key])}
                  locked={item.locked}
                  onChange={(v) => setPreference(item.key, v)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:gap-2 sm:px-5">
          {!manageOpen ? (
            <>
              <button
                type="button"
                onClick={openManage}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Settings2 size={14} /> Manage
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                Accept
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={savePreferences}
                className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-600"
              >
                Save preferences
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
