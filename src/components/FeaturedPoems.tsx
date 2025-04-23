import React from 'react';
import { Link } from 'react-router-dom';
import { usePoems } from '../context/PoemContext';

const FeaturedPoems: React.FC = () => {
  const { featuredPoems } = usePoems();
  
  if (featuredPoems.length === 0) {
    return null;
  }
  
  // Get the main feature (first poem)
  const mainFeature = featuredPoems[0];
  // Get secondary features (other poems)
  const secondaryFeatures = featuredPoems.slice(1);
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold text-gray-800 mb-8 text-center">
          Featured Poems
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feature */}
          <div className="lg:col-span-2">
            <Link to={`/poem/${mainFeature.id}`}>
              <div className="relative h-96 rounded-lg overflow-hidden group">
                <img 
                  src={mainFeature.coverImage} 
                  alt={mainFeature.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium mb-2 inline-block
                    ${mainFeature.language === 'english' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {mainFeature.language === 'english' ? 'English' : 'ಕನ್ನಡ'}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold">
                    {mainFeature.title}
                  </h3>
                  {mainFeature.subtitle && (
                    <p className="text-white/90 mt-1">{mainFeature.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
          </div>
          
          {/* Secondary Features */}
          <div className="space-y-6">
            {secondaryFeatures.map(poem => (
              <Link key={poem.id} to={`/poem/${poem.id}`}>
                <div className="relative h-44 rounded-lg overflow-hidden group">
                  <img 
                    src={poem.coverImage} 
                    alt={poem.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium mb-1 inline-block
                      ${poem.language === 'english' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                      {poem.language === 'english' ? 'English' : 'ಕನ್ನಡ'}
                    </span>
                    <h3 className="font-serif text-xl font-bold">
                      {poem.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPoems;