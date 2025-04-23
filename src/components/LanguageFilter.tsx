import React from 'react';
import { usePoems } from '../context/PoemContext';
import { Language } from '../types';

const LanguageFilter: React.FC = () => {
  const { activeLanguage, setActiveLanguage } = usePoems();
  
  const filters = [
    { value: 'all', label: 'All Poems' },
    { value: 'english', label: 'English' },
    { value: 'kannada', label: 'ಕನ್ನಡ' }
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setActiveLanguage(filter.value as Language | 'all')}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
            ${activeLanguage === filter.value
              ? 'bg-blue-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
          `}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageFilter;