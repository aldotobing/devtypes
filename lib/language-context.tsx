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
    const detectLanguage = async () => {
      try {
        // Try to get saved language first
        const savedLang = localStorage.getItem('devtype-language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
          setLanguage(savedLang);
          setT(getTranslations(savedLang));
          return;
        }

        // Try to detect language from geolocation
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject('Geolocation not supported');
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        // Use reverse geocoding to get country code
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        const countryCode = data.countryCode?.toLowerCase();
        
        // Map country codes to supported languages
        const countryToLang: Record<string, Language> = {
          id: 'id', // Indonesia
          my: 'en', // Malaysia
          sg: 'en', // Singapore
          // Add more country codes as needed
        };

        const detectedLang = countryToLang[countryCode] || 
                           (navigator.language.toLowerCase().startsWith('en') ? 'en' : 'id');
        
        setLanguage(detectedLang);
        setT(getTranslations(detectedLang));
        localStorage.setItem('devtype-language', detectedLang);
      } catch (error) {
        console.error('Error detecting language:', error);
        // Fallback to browser language
        const browserLang = navigator.language.toLowerCase();
        const detectedLang = browserLang.startsWith('id') ? 'id' : 'en';
        setLanguage(detectedLang);
        setT(getTranslations(detectedLang));
      }
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