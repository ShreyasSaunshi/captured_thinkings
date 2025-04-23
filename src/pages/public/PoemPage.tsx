import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { usePoems } from '../../context/PoemContext';
import PoemContent from '../../components/PoemContent';
import { Poem } from '../../types';

const PoemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { poems } = usePoems();
  const [poem, setPoem] = useState<Poem | null>(null);
  
  useEffect(() => {
    if (!id) return;
    const foundPoem = poems.find(p => p.id === id);
    if (foundPoem) {
      setPoem(foundPoem);
    }
  }, [id, poems]);
  
  if (!poem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">Poem not found</p>
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