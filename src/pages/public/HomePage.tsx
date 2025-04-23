import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePoems } from '../../context/PoemContext';
import FeaturedPoems from '../../components/FeaturedPoems';
import PoemCard from '../../components/PoemCard';
import LanguageFilter from '../../components/LanguageFilter';
import { Language } from '../../types';

const HomePage: React.FC = () => {
  const { poems, error, activeLanguage, setActiveLanguage } = usePoems();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const languageParam = searchParams.get('language');
    if (languageParam && (languageParam === 'english' || languageParam === 'kannada')) {
      setActiveLanguage(languageParam as Language);
    }
  }, [searchParams, setActiveLanguage]);
  
  const filteredPoems = activeLanguage === 'all'
    ? poems
    : poems.filter(poem => poem.language === activeLanguage);
  
  return (
    <div>
      <section className="relative h-96 md:h-[30rem] bg-cover bg-center" 
        style={{backgroundImage: 'url(https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg)'}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-2xl px-4">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
              Captured Thinkings
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8">
              A bilingual sanctuary for poetic expression, showcasing beautiful poems in English and Kannada.
            </p>
          </div>
        </div>
      </section>
      
      <FeaturedPoems />
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-8">
            Browse Poems
          </h2>
          
          <LanguageFilter />
          
          {error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : filteredPoems.length === 0 ? (
            <div className="text-center py-10">
              <p>No poems found for the selected language.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPoems.map(poem => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;