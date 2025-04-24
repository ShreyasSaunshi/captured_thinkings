import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Poem, Language } from '../types';
import { supabase, checkSupabaseConnection, retryOperation, logSupabaseOperation } from '../lib/supabase';

interface PoemContextType {
  poems: Poem[];
  featuredPoems: Poem[];
  error: string | null;
  activeLanguage: Language | 'all';
  togglePoemVisibility: (id: string) => Promise<void>;
  togglePoemFeatured: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  addComment: (id: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  addPoem: (poem: Omit<Poem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
  updatePoem: (id: string, poem: Partial<Poem>) => Promise<void>;
  deletePoem: (id: string) => Promise<void>;
  setActiveLanguage: (language: Language | 'all') => void;
  refreshPoems: (listedOnly?: boolean) => Promise<void>;
}

const PoemContext = createContext<PoemContextType>({
  poems: [],
  featuredPoems: [],
  error: null,
  activeLanguage: 'all',
  togglePoemVisibility: async () => {},
  togglePoemFeatured: async () => {},
  toggleLike: async () => {},
  addComment: async () => {},
  deleteComment: async () => {},
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
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<Language | 'all'>('all');

  const refreshPoems = async (listedOnly = true) => {
    try {
      setError(null);

      const isConnected = await retryOperation(checkSupabaseConnection);
      if (!isConnected) {
        throw new Error('Unable to connect to database after multiple attempts');
      }

      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      const fetchPoems = async () => {
        let query = supabase
          .from('poems')
          .select(`
            *,
            poem_likes (
              id,
              user_id
            ),
            poem_comments (
              id,
              content,
              user_id,
              created_at,
              updated_at
            )
          `)
          .order('created_at', { ascending: false });

        if (listedOnly) {
          query = query.eq('is_listed', true);
        }

        const result = await query;
        logSupabaseOperation('fetch poems', result);

        if (result.error) throw result.error;
        if (!result.data) throw new Error('No data received from database');

        return result.data;
      };

      const poemsData = await retryOperation(fetchPoems);

      const processedPoems = poemsData.map(poem => ({
        id: poem.id,
        title: poem.title,
        subtitle: poem.subtitle || undefined,
        content: poem.content,
        coverImage: poem.cover_image,
        language: poem.language as Language,
        isListed: poem.is_listed,
        isFeatured: poem.is_featured,
        createdAt: poem.created_at,
        updatedAt: poem.updated_at,
        likes: poem.poem_likes?.length || 0,
        hasLiked: userId ? poem.poem_likes?.some(like => like.user_id === userId) || false : false,
        comments: poem.poem_comments?.map(comment => ({
          id: comment.id,
          content: comment.content,
          userId: comment.user_id,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at
        })) || []
      }));

      setPoems(processedPoems);
      setFeaturedPoems(processedPoems.filter(poem => poem.isFeatured));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load poems';
      setError(errorMessage);
      console.error('Error loading poems:', err);
    }
  };

  useEffect(() => {
    refreshPoems();

    // Subscribe to realtime changes
    const poemLikesSubscription = supabase
      .channel('poem_likes_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'poem_likes' 
      }, () => {
        refreshPoems();
      })
      .subscribe();

    const poemCommentsSubscription = supabase
      .channel('poem_comments_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'poem_comments' 
      }, () => {
        refreshPoems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(poemLikesSubscription);
      supabase.removeChannel(poemCommentsSubscription);
    };
  }, []);

  const toggleLike = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('Please sign in to like poems');
      }

      const userId = session.session.user.id;
      const poem = poems.find(p => p.id === id);
      if (!poem) return;

      if (poem.hasLiked) {
        const result = await supabase
          .from('poem_likes')
          .delete()
          .eq('poem_id', id)
          .eq('user_id', userId);

        logSupabaseOperation('remove like', result);
        if (result.error) throw result.error;
      } else {
        const result = await supabase
          .from('poem_likes')
          .insert({
            poem_id: id,
            user_id: userId
          });

        logSupabaseOperation('add like', result);
        if (result.error) throw result.error;
      }

      await refreshPoems();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update like';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addComment = async (id: string, content: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('Please sign in to comment');
      }

      const result = await supabase
        .from('poem_comments')
        .insert({
          poem_id: id,
          user_id: session.session.user.id,
          content: content
        });

      logSupabaseOperation('add comment', result);
      if (result.error) throw result.error;

      await refreshPoems();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setError('Please sign in to manage comments');
        return;
      }

      const result = await supabase
        .from('poem_comments')
        .delete()
        .eq('id', commentId);

      logSupabaseOperation('delete comment', result);
      if (result.error) throw result.error;

      await refreshPoems(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const togglePoemVisibility = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setError('Please sign in to manage poems');
        return;
      }

      const poem = poems.find(p => p.id === id);
      if (!poem) return;

      const result = await supabase
        .from('poems')
        .update({ is_listed: !poem.isListed })
        .eq('id', id);
      
      logSupabaseOperation('toggle visibility', result);

      if (result.error) throw result.error;

      await refreshPoems(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update poem visibility';
      setError(errorMessage);
      console.error('Error updating poem visibility:', err);
    }
  };

  const togglePoemFeatured = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setError('Please sign in to manage poems');
        return;
      }

      const poem = poems.find(p => p.id === id);
      if (!poem) return;

      const featuredCount = poems.filter(p => p.isFeatured).length;
      if (!poem.isFeatured && featuredCount >= 5) {
        throw new Error('Cannot feature more than 5 poems');
      }

      const result = await supabase
        .from('poems')
        .update({ is_featured: !poem.isFeatured })
        .eq('id', id);
      
      logSupabaseOperation('toggle featured', result);

      if (result.error) throw result.error;

      await refreshPoems(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update featured status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const addPoem = async (poemData: Omit<Poem, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setError('Please sign in to add poems');
        return;
      }

      const result = await supabase
        .from('poems')
        .insert({
          title: poemData.title,
          subtitle: poemData.subtitle,
          content: poemData.content,
          cover_image: poemData.coverImage,
          language: poemData.language,
          is_listed: poemData.isListed,
          is_featured: false,
          user_id: session.session.user.id
        });

      logSupabaseOperation('add poem', result);

      if (result.error) throw result.error;

      await refreshPoems(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add poem';
      setError(errorMessage);
      console.error('Error adding poem:', err);
    }
  };

  const updatePoem = async (id: string, poemData: Partial<Poem>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setError('Please sign in to update poems');
        return;
      }

      const result = await supabase
        .from('poems')
        .update({
          title: poemData.title,
          subtitle: poemData.subtitle,
          content: poemData.content,
          cover_image: poemData.coverImage,
          language: poemData.language,
          is_listed: poemData.isListed,
          is_featured: poemData.isFeatured
        })
        .eq('id', id);

      logSupabaseOperation('update poem', result);

      if (result.error) throw result.error;

      await refreshPoems(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update poem';
      setError(errorMessage);
      console.error('Error updating poem:', err);
    }
  };

  const deletePoem = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        setError('Please sign in to delete poems');
        return;
      }

      const result = await supabase
        .from('poems')
        .delete()
        .eq('id', id);

      logSupabaseOperation('delete poem', result);

      if (result.error) throw result.error;

      await refreshPoems(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete poem';
      setError(errorMessage);
      console.error('Error deleting poem:', err);
    }
  };

  return (
    <PoemContext.Provider 
      value={{ 
        poems,
        featuredPoems,
        error,
        activeLanguage,
        togglePoemVisibility,
        togglePoemFeatured,
        toggleLike,
        addComment,
        deleteComment,
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