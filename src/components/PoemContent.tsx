import React from 'react';
import { Poem } from '../types';
import PoemInteractions from './PoemInteractions';

interface PoemContentProps {
  poem: Poem;
}

const PoemContent: React.FC<PoemContentProps> = ({ poem }) => {
  const { 
    title, 
    subtitle, 
    content, 
    coverImage, 
    language,
    id,
    likes,
    hasLiked,
    comments
  } = poem;
  
  // Process the poem content to maintain line breaks
  const formattedContent = content.split('\n').map((line, index) => (
    <p key={index} className={`mb-4 ${line.trim() === '' ? 'h-4' : ''}`}>
      {line.trim() === '' ? '\u00A0' : line}
    </p>
  ));
  
  // Language-specific style adjustments
  const languageStyles = language === 'kannada' 
    ? 'font-kannada text-lg leading-relaxed' 
    : 'leading-relaxed';
  
  const languageLabel = language === 'english' ? 'English' : 'ಕನ್ನಡ';
  const languageClass = language === 'english' 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-amber-100 text-amber-800';
  
  return (
    <article className="max-w-3xl mx-auto">
      <div className="relative h-80 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${languageClass} mb-4 inline-block`}>
            {languageLabel}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/90 md:text-lg italic">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <div className={`prose max-w-none ${languageStyles} px-4 md:px-0`}>
        {formattedContent}
      </div>

      <PoemInteractions
        poemId={id}
        likes={likes}
        hasLiked={hasLiked}
        comments={comments}
      />
    </article>
  );
};

export default PoemContent;