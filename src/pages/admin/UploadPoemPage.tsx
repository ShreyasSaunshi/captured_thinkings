import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookPlus } from 'lucide-react';
import { usePoems } from '../../context/PoemContext';
import PoemForm from '../../components/admin/PoemForm';
import { Poem } from '../../types';
import { supabase, logSupabaseOperation } from '../../lib/supabase';

const UploadPoemPage: React.FC = () => {
  const { addPoem } = usePoems();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (
    poemData: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Get the current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error('Authentication error: ' + sessionError.message);
      }
      
      if (!session) {
        throw new Error('No active session found. Please log in again.');
      }
      
      // Insert the poem with debug logging
      const { data, error: insertError } = await supabase
        .from('poems')
        .insert({
          title: poemData.title,
          subtitle: poemData.subtitle || null,
          content: poemData.content,
          cover_image: poemData.coverImage,
          language: poemData.language,
          is_listed: poemData.isListed,
          user_id: session.user.id
        })
        .select()
        .single();
      
      logSupabaseOperation('insert poem', { data, error: insertError });
      
      if (insertError) {
        throw new Error('Failed to create poem: ' + insertError.message);
      }
      
      if (!data) {
        throw new Error('No data returned after poem creation');
      }
      
      // Call the context method to update local state
      await addPoem(poemData);
      
      navigate('/admin/manage', { 
        state: { message: 'Poem successfully created!' } 
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create poem';
      setError(errorMessage);
      console.error('Error creating poem:', err);
    } finally {
      setIsSubmitting(false);
    }
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
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
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