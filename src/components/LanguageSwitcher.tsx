
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ne' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
      title={language === 'en' ? 'Switch to Nepali' : 'अंग्रेजीमा स्विच गर्नुहोस्'}
    >
      <Globe size={16} />
      <span className="text-sm font-medium">
        {language === 'en' ? 'नेपाली' : 'English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
