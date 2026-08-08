// i18n infrastructure for ALTIX
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Locale = Record<string, string>;

interface I18nContextProps {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState('pt-BR');
  const [messages, setMessages] = useState<Locale>({});

  // Load stored language
  useEffect(() => {
    const stored = localStorage.getItem('altix-language');
    if (stored) setLangState(stored);
  }, []);

  // Load locale file when language changes
  useEffect(() => {
    async function loadLocale() {
      try {
        const res = await fetch(`/locales/${lang}.json`);
        const json = await res.json();
        setMessages(json);
        localStorage.setItem('altix-language', lang);
      } catch (e) {
        console.error('Failed to load locale', e);
      }
    }
    loadLocale();
  }, [lang]);

  const setLang = (newLang: string) => {
    setLangState(newLang);
    // locale will be loaded by effect
  };

  const t = (key: string) => messages[key] ?? key;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useLanguage must be used within I18nProvider');
  return context;
};
