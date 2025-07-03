'use client'; 

import { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  // store in localstorage
  useEffect(() => {
    const stored = localStorage.getItem('language');
    if (stored) setLanguage(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.className = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
