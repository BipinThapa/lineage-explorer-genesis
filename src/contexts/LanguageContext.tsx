
import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Translation object
const translations = {
  en: {
    // Family Tree
    'family.tree': 'Family Tree',
    'admin.panel': 'Admin Panel',
    'admin.login': 'Admin Login',
    'logout': 'Logout',
    'clear.focus': 'Clear Focus',
    
    // Member details
    'Born': 'Born',
    'biography': 'Biography',
    'spouse': 'Spouse',
    'parents': 'Parents',
    'children': 'Children',
    'relationship': 'Relationship',
    
    // Actions
    'add.member': 'Add Member',
    'edit.member': 'Edit Member',
    'export.data': 'Export Data',
    'import.data': 'Import Data',
    'save': 'Save',
    'cancel': 'Cancel',
    'close': 'Close',
    'edit': 'Edit',
    
    // Login
    'admin.password': 'Admin Password',
    'enter.admin.password': 'Enter admin password',
    'default.password': 'Default password: admin123',
    'login': 'Login',
    
    // Messages
    'member.added.successfully': 'Member added successfully',
    'member.updated.successfully': 'Member updated successfully',
    'data.exported.successfully': 'Data exported successfully',
    'data.imported.successfully': 'Data imported successfully',
    'admin.access.granted': 'Admin access granted',
    'logged.out.successfully': 'Logged out successfully',
    'invalid.password': 'Invalid password',
    'invalid.file.format': 'Invalid file format',
    'failed.to.load.family.data': 'Failed to load family data'
  },
  ne: {
    // Family Tree
    'family.tree': 'पारिवारिक वृक्ष',
    'admin.panel': 'व्यवस्थापक प्यानल',
    'admin.login': 'व्यवस्थापक लगइन',
    'logout': 'लगआउट',
    'clear.focus': 'फोकस हटाउनुहोस्',
    
    // Member details
    'Born': 'जन्मदिन',
    'biography': 'जीवनी',
    'spouse': 'जीवनसाथी',
    'parents': 'आमाबुबा',
    'children': 'सन्तानहरू',
    'relationship': 'सम्बन्ध',
    
    // Actions
    'add.member': 'सदस्य थप्नुहोस्',
    'edit.member': 'सदस्य सम्पादन गर्नुहोस्',
    'export.data': 'डाटा निर्यात गर्नुहोस्',
    'import.data': 'डाटा आयात गर्नुहोस्',
    'save': 'सेभ गर्नुहोस्',
    'cancel': 'रद्द गर्नुहोस्',
    'close': 'बन्द गर्नुहोस्',
    'edit': 'सम्पादन गर्नुहोस्',
    
    // Login
    'admin.password': 'व्यवस्थापक पासवर्ड',
    'enter.admin.password': 'व्यवस्थापक पासवर्ड प्रविष्ट गर्नुहोस्',
    'default.password': 'पूर्वनिर्धारित पासवर्ड: admin123',
    'login': 'लगइन',
    
    // Messages
    'member.added.successfully': 'सदस्य सफलतापूर्वक थपियो',
    'member.updated.successfully': 'सदस्य सफलतापूर्वक अपडेट भयो',
    'data.exported.successfully': 'डाटा सफलतापूर्वक निर्यात भयो',
    'data.imported.successfully': 'डाटा सफलतापूर्वक आयात भयो',
    'admin.access.granted': 'व्यवस्थापक पहुँच प्रदान गरियो',
    'logged.out.successfully': 'सफलतापूर्वक लगआउट भयो',
    'invalid.password': 'गलत पासवर्ड',
    'invalid.file.format': 'गलत फाइल ढाँचा',
    'failed.to.load.family.data': 'पारिवारिक डाटा लोड गर्न असफल'
  }
};
