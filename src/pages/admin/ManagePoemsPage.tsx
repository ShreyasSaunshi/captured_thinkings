import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BookOpen, AlertCircle } from 'lucide-react';
import { usePoems } from '../../context/PoemContext';
import AdminPoemList from '../../components/admin/AdminPoemList';

const ManagePoemsPage: React.FC = () => {
  const location = useLocation();
  const { poems, loading, error, togglePoemVisibility, togglePoemFeatured, deletePoem, refreshPoems } = usePoems();
  const [notification, setNotification] = useState<string | null>(null);
  
  useEffect(() => {
    // Get all poems including unlisted
    refreshPoems(false);
  }, [refreshPoems]);
  
  useEffect(() => {
    // Check for success message from redirect
    const state = location.state as { message?: string } | null;
    if (state?.message) {
      setNotification(state.message);
      
      // Clear message from location state and notification after a delay
      const timer = setTimeout(() => {
        setNotification(null);
        window.history.replaceState({}, '');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  const handleToggleVisibility = (id: string) => {
    togglePoemVisibility(id);
    setNotification('Poem visibility updated!');
    
    // Clear notification after a delay
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      await togglePoemFeatured(id);
      setNotification('Featured status updated successfully!');
      
      // Clear notification after a delay
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      setNotification(error instanceof Error ? error.message : 'Failed to update featured status');
    }
  };
  
  const handleDeletePoem = (id: string) => {
    // In a real app, this would include a confirmation dialog
    if (window.confirm('Are you sure you want to delete this poem? This action cannot be undone.')) {
      deletePoem(id);
      setNotification('Poem successfully deleted!');
      
      // Clear notification after a delay
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  
  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center mb-8">
        <BookOpen className="text-blue-900 mr-3" size={28} />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Manage Poems
          </h1>
          <p className="text-gray-600">
            View, edit, and control visibility of your poems
          </p>
        </div>
      </div>
      
      {notification && (
        <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{notification}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <AdminPoemList
        poems={poems}
        onToggleVisibility={handleToggleVisibility}
        onToggleFeatured={handleToggleFeatured}
        onDelete={handleDeletePoem}
        isLoading={loading}
      />
    </div>
  );
};

export default ManagePoemsPage;