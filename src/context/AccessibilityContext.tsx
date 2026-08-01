import React, { createContext, useState, useContext } from 'react';

interface AccessibilityState {
  largeFont: boolean;
  highContrast: boolean;
  voiceMode: boolean;
  simpleLanguage: boolean;
  darkMode: boolean;
  setLargeFont: (val: boolean) => void;
  setHighContrast: (val: boolean) => void;
  setVoiceMode: (val: boolean) => void;
  setSimpleLanguage: (val: boolean) => void;
  setDarkMode: (val: boolean) => void;
  fontSizeMultiplier: number;
  backgroundColor: string;
  textColor: string;
  cardColor: string;
}

const AccessibilityContext = createContext<AccessibilityState>({
  largeFont: false,
  highContrast: false,
  voiceMode: true,
  simpleLanguage: true,
  darkMode: false,
  setLargeFont: () => {},
  setHighContrast: () => {},
  setVoiceMode: () => {},
  setSimpleLanguage: () => {},
  setDarkMode: () => {},
  fontSizeMultiplier: 1,
  backgroundColor: '#FAFAFA',
  textColor: '#212121',
  cardColor: '#FFFFFF',
});

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [largeFont, setLargeFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const [simpleLanguage, setSimpleLanguage] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const fontSizeMultiplier = largeFont ? 1.25 : 1;

  let backgroundColor = '#FAFAFA';
  let textColor = '#212121';
  let cardColor = '#FFFFFF';

  if (highContrast) {
    backgroundColor = '#000000';
    textColor = '#FFFFFF';
    cardColor = '#121212';
  } else if (darkMode) {
    backgroundColor = '#0F172A';
    textColor = '#F8FAFC';
    cardColor = '#1E293B';
  }

  return (
    <AccessibilityContext.Provider
      value={{
        largeFont,
        highContrast,
        voiceMode,
        simpleLanguage,
        darkMode,
        setLargeFont,
        setHighContrast,
        setVoiceMode,
        setSimpleLanguage,
        setDarkMode,
        fontSizeMultiplier,
        backgroundColor,
        textColor,
        cardColor,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
