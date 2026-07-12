import { useEffect } from 'react';
import { useConsentStore } from '../store/consentStore';

const ADSENSE_SCRIPT_ID = 'starstore-adsense';

/**
 * Loads non-essential third-party scripts only after explicit consent.
 * Set VITE_ADSENSE_CLIENT (e.g. ca-pub-XXXXXXXX) when ready to serve ads.
 */
export default function ConsentGatedScripts() {
  const advertising = useConsentStore((s) => s.preferences.advertising);
  const decided = useConsentStore((s) => s.decided);

  useEffect(() => {
    const client = import.meta.env.VITE_ADSENSE_CLIENT;
    if (!client || !decided || !advertising) {
      const existing = document.getElementById(ADSENSE_SCRIPT_ID);
      if (existing) existing.remove();
      return;
    }

    if (document.getElementById(ADSENSE_SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    return () => {
      const node = document.getElementById(ADSENSE_SCRIPT_ID);
      if (node) node.remove();
    };
  }, [advertising, decided]);

  return null;
}
