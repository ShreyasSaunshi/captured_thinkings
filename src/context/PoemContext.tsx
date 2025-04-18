import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Poem, Language } from '../types';
import { supabase } from '../lib/supabase';

interface PoemContextType {
  poems: Poem[];
  featuredPoems: Poem[];
  loading: boolean;
  error: string | null;
  activeLanguage: Language | 'all';
  togglePoemVisibility: (id: string) => Promise<void>;
  addPoem: (poem: Omit<Poem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updatePoem: (id: string, poem: Partial<Poem>) => Promise<void>;
  deletePoem: (id: string) => Promise<void>;
  setActiveLanguage: (language: Language | 'all') => void;
  refreshPoems: (listedOnly?: boolean) => Promise<void>;
}

const PoemContext = createContext<PoemContextType>({
  poems: [],
  featuredPoems: [],
  loading: false,
  error: null,
  activeLanguage: 'all',
  togglePoemVisibility: async () => {},
  addPoem: async () => {},
  updatePoem: async () => {},
  deletePoem: async () => {},
  setActiveLanguage: () => {},
  refreshPoems: async () => {}
});

export const usePoems = () => useContext(PoemContext);

export const PoemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [featuredPoems, setFeaturedPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<Language | 'all'>('all');

  const refreshPoems = async (listedOnly = true) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('poems')
        .select('*')
        .order('created_at', { ascending: false });

      if (listedOnly) {
        query = query.eq('is_listed', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const poemsData = data.map(poem => ({
        id: poem.id,
        title: poem.title,
        subtitle: poem.subtitle || undefined,
        content: poem.content,
        coverImage: poem.cover_image,
        language: poem.language as Language,
        isListed: poem.is_listed,
        createdAt: poem.created_at,
        updatedAt: poem.updated_at
      }));

      setPoems(poemsData);
      setFeaturedPoems(poemsData.slice(0, 3));
    } catch (err) {
      setError('Failed to load poems');
      console.error('Error loading poems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshPoems();
  }, []);

  const togglePoemVisibility = async (id: string) => {
    try {
      const poem = poems.find(p => p.id === id);
      if (!poem) return;

      const { error: updateError } = await supabase
        .from('poems')
        .update({ is_listed: !poem.isListed })
        .eq('id', id);

      if (updateError) throw updateError;

      await refreshPoems(false);
    } catch (err) {
      setError('Failed to update poem visibility');
      console.error('Error updating poem visibility:', err);
    }
  };

  const addPoem = async (poemData: Omit<Poem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { error: insertError } = await supabase
        .from('poems')
        .insert({
          title: poemData.title,
          subtitle: poemData.subtitle,
          content: poemData.content,
          cover_image: poemData.coverImage,
          language: poemData.language,
          is_listed: poemData.isListed,
          user_id: userData.user.id
        });

      if (insertError) throw insertError;

      await refreshPoems(false);
    } catch (err) {
      setError('Failed to add poem');
      console.error('Error adding poem:', err);
    }
  };

  const updatePoem = async (id: string, poemData: Partial<Poem>) => {
    try {
      const { error: updateError } = await supabase
        .from('poems')
        .update({
          title: poemData.title,
          subtitle: poemData.subtitle,
          content: poemData.content,
          cover_image: poemData.coverImage,
          language: poemData.language,
          is_listed: poemData.isListed
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await refreshPoems(false);
    } catch (err) {
      setError('Failed to update poem');
      console.error('Error updating poem:', err);
    }
  };

  const deletePoem = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('poems')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await refreshPoems(false);
    } catch (err) {
      setError('Failed to delete poem');
      console.error('Error deleting poem:', err);
    }
  };

  return (
    <PoemContext.Provider 
      value={{ 
        poems,
        featuredPoems,
        loading,
        error,
        activeLanguage,
        togglePoemVisibility,
        addPoem,
        updatePoem,
        deletePoem,
        setActiveLanguage,
        refreshPoems
      }}
    >
      {children}
    </PoemContext.Provider>
  );
};