// Language Switcher component (client side)
'use client';

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';

const languages = [
  { code: 'pt-BR', label: 'Português (BR)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-AU', label: 'English (AU)' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'it', label: 'Italiano' },
  { code: 'da', label: 'Dansk' },
  { code: 'ga', label: 'Gaelige' },
  { code: 'ru', label: 'Русский' },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value);
  };

  return (
    <select
      value={lang}
      onChange={handleChange}
      className="bg-white/10 text-altix-muted rounded px-2 py-1 text-xs focus:outline-none"
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
