import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookPlus } from 'lucide-react';
import { usePoems } from '../../context/PoemContext';
import PoemForm from '../../components/admin/PoemForm';
import { Poem } from '../../types';

const UploadPoemPage: React.FC = () => {
  const { addPoem } = usePoems();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (
    poemData: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      addPoem(poemData);
      setIsSubmitting(false);
      navigate('/admin/manage', { 
        state: { message: 'Poem successfully created!' } 
      });
    }, 800);
  };
  
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center mb-8">
        <BookPlus className="text-blue-900 mr-3" size={28} />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Upload New Poem
          </h1>
          <p className="text-gray-600">
            Add a new poem to your collection
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <PoemForm 
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default UploadPoemPage;