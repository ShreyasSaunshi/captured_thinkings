import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book as BookEdit, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePoems } from '../../context/PoemContext';
import PoemForm from '../../components/admin/PoemForm';
import Button from '../../components/ui/Button';
import { Poem } from '../../types';

const EditPoemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { poems, updatePoem } = usePoems();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundPoem = poems.find(p => p.id === id);
      if (foundPoem) {
        setPoem(foundPoem);
      }
      setIsLoading(false);
    }
  }, [id, poems]);
  
  const handleSubmit = (
    poemData: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!id) return;
    
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      updatePoem(id, poemData);
      setIsSubmitting(false);
      navigate('/admin/manage', { 
        state: { message: 'Poem successfully updated!' } 
      });
    }, 800);
  };
  
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>Loading poem...</p>
      </div>
    );
  }
  
  if (!poem) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Poem not found</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/manage')}
        >
          Back to Manage Poems
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6 md:p-8">
      <Link to="/admin/manage" className="inline-flex items-center text-blue-900 hover:underline mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to Manage Poems
      </Link>
      
      <div className="flex items-center mb-8">
        <BookEdit className="text-blue-900 mr-3" size={28} />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Edit Poem
          </h1>
          <p className="text-gray-600">
            Update poem details or content
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <PoemForm 
          initialData={poem}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};

export default EditPoemPage;