import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = false
}) => {
  const hoverClasses = hoverable 
    ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer dark:hover:shadow-dark' 
    : '';
  
  return (
    <div 
      className={`bg-white dark:bg-dark-card rounded-lg shadow-md dark:shadow-dark overflow-hidden transition-colors-transform duration-300 ${hoverClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-4 bg-gray-50 dark:bg-dark-hover ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`p-4 bg-gray-50 dark:bg-dark-hover ${className}`}>
      {children}
    </div>
  );
};

export default Card;