'use client';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/app/lib/i18n';

export default function CookieConsent() {
  const [visible, setVisible] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('altix-cookie-consent');
    if (consent) setVisible(false);
  }, []);

  const accept = () => {
    localStorage.setItem('altix-cookie-consent', 'accepted');
    setVisible(false);
  };
  const reject = () => {
    localStorage.setItem('altix-cookie-consent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 max-w-md w-full bg-altix-bg border border-white/10 rounded-xl p-4 shadow-glow glass-card">
      <p className="text-sm text-altix-muted mb-2">{t('cookie.consent_message')}</p>
      <div className="flex justify-end gap-2">
        <button onClick={reject} className="px-3 py-1 rounded bg-white/10 text-altix-muted hover:bg-white/20 transition">
          {t('cookie.reject')}
        </button>
        <button onClick={accept} className="px-3 py-1 rounded bg-altix-green text-black hover:bg-altix-green-light transition">
          {t('cookie.accept')}
        </button>
      </div>
    </div>
  );
}
