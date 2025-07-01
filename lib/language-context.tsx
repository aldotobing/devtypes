"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getTranslations, Translations } from './i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('id');
  const [t, setT] = useState<Translations>(getTranslations('id'));

  useEffect(() => {
    const detectLanguage = () => {
      // Try to get saved language first
      const savedLang = localStorage.getItem('devtype-language') as Language;
      if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
        setLanguage(savedLang);
        setT(getTranslations(savedLang));
        return;
      }
      
      // Fallback to browser language
      const browserLang = navigator.language.toLowerCase();
      const detectedLang = browserLang.startsWith('id') ? 'id' : 'en';
      setLanguage(detectedLang);
      setT(getTranslations(detectedLang));
      localStorage.setItem('devtype-language', detectedLang);
    };

    detectLanguage();
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setT(getTranslations(lang));
    localStorage.setItem('devtype-language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}