"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('العربية');
  
  const languages = [
    { code: 'ar', name: 'العربية' },
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={toggleDropdown}
        className="flex items-center gap-2 text-[#898989] hover:text-white transition-colors px-3 py-2 rounded-md bg-[#898989]/10 border border-[#898989]/20"
      >
        <Globe size={16} />
        <span className="text-sm">{language}</span>
        <ChevronDown 
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-[#1E1E1E] border border-[#898989]/20 z-20">
          <ul className="py-1">
            {languages.map((lang) => (
              <li key={lang.code}>
                <button
                  onClick={() => selectLanguage(lang.name)}
                  className="block w-full text-right px-4 py-2 text-sm hover:bg-[#898989]/10 transition-colors"
                >
                  {lang.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}