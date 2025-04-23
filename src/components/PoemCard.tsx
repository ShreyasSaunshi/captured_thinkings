import React from 'react';
import { Link } from 'react-router-dom';
import { Poem } from '../types';
import Card from './ui/Card';

interface PoemCardProps {
  poem: Poem;
  isAdmin?: boolean;
}

const PoemCard: React.FC<PoemCardProps> = ({ poem, isAdmin = false }) => {
  const { id, title, subtitle, coverImage, language } = poem;
  
  const languageLabel = language === 'english' ? 'English' : 'ಕನ್ನಡ';
  const languageClass = language === 'english' 
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
    : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100';
  
  return (
    <Link to={isAdmin ? `/admin/poem/${id}` : `/poem/${id}`}>
      <Card hoverable className="h-full flex flex-col bg-white dark:bg-dark-card">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={coverImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-0 right-0 m-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${languageClass}`}>
              {languageLabel}
            </span>
          </div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-serif text-xl font-bold mb-1 text-gray-800 dark:text-dark">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-dark-muted italic mb-2">{subtitle}</p>
          )}
          <div className="mt-auto pt-4">
            <span className="text-blue-900 dark:text-blue-400 text-sm font-medium hover:underline">
              Read poem →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PoemCard;