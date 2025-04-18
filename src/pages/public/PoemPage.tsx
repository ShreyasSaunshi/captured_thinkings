import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPoemById } from '../../data/poems';
import { Poem } from '../../types';
import PoemContent from '../../components/PoemContent';

const PoemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      const fetchedPoem = getPoemById(id);
      
      if (fetchedPoem) {
        setPoem(fetchedPoem);
        setError(null);
      } else {
        setError('Poem not found');
      }
      
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading poem...</p>
      </div>
    );
  }
  
  if (error || !poem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">{error || 'Poem not found'}</p>
        <Link to="/" className="text-blue-900 hover:underline inline-flex items-center">
          <ArrowLeft size={16} className="mr-1" />
          Return to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <Link to="/" className="text-blue-900 hover:underline inline-flex items-center mb-8">
          <ArrowLeft size={16} className="mr-1" />
          Back to Home
        </Link>
        
        <PoemContent poem={poem} />
      </div>
    </div>
  );
};

export default PoemPage;