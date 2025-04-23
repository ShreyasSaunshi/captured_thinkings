import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, BookMarked, FileText, Eye, Languages } from 'lucide-react';
import { usePoems } from '../../context/PoemContext';
import Button from '../../components/ui/Button';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';

const DashboardPage: React.FC = () => {
  const { poems, loading, error, refreshPoems } = usePoems();
  const [stats, setStats] = useState({
    totalPoems: 0,
    publishedPoems: 0,
    englishPoems: 0,
    kannadaPoems: 0,
  });
  
  useEffect(() => {
    refreshPoems(false); // Get all poems including unlisted
  }, [refreshPoems]);
  
  useEffect(() => {
    if (!loading && poems.length) {
      setStats({
        totalPoems: poems.length,
        publishedPoems: poems.filter(poem => poem.isListed).length,
        englishPoems: poems.filter(poem => poem.language === 'english').length,
        kannadaPoems: poems.filter(poem => poem.language === 'kannada').length,
      });
    }
  }, [poems, loading]);
  
  if (loading) {
    return (
      <div className="p-8 text-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button variant="primary" onClick={() => refreshPoems(false)}>
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your poetry content and website settings
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to="/admin/upload">
            <Button variant="primary">
              <PlusCircle size={18} className="mr-2" />
              Add New Poem
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800 mr-4">
                <BookMarked size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Poems</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalPoems}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-800 mr-4">
                <Eye size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.publishedPoems}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-800 mr-4">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">English Poems</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.englishPoems}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 text-amber-800 mr-4">
                <Languages size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Kannada Poems</p>
                <h3 className="text-2xl font-bold text-gray-800">{stats.kannadaPoems}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <CardHeader className="bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
        </CardHeader>
        <CardContent>
          {poems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No poems have been created yet.</p>
              <Link to="/admin/upload" className="text-blue-900 hover:underline">
                Add your first poem →
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {poems.slice(0, 5).map(poem => {
                const date = new Date(poem.updatedAt);
                const formattedDate = date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                
                return (
                  <div key={poem.id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded overflow-hidden mr-4">
                        <img 
                          src={poem.coverImage} 
                          alt={poem.title}
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{poem.title}</p>
                        <p className="text-sm text-gray-500">
                          {poem.isListed ? 'Published' : 'Unlisted'} · {formattedDate}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Link 
                        to={`/admin/edit/${poem.id}`}
                        className="text-blue-900 hover:underline text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/upload">
          <Card hoverable className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-blue-100 text-blue-800 mr-3">
                  <PlusCircle size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Add New Poem</h3>
              </div>
              <p className="text-gray-600">
                Create and publish a new poem in either English or Kannada.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/admin/manage">
          <Card hoverable className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-green-100 text-green-800 mr-3">
                  <BookMarked size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Manage Poems</h3>
              </div>
              <p className="text-gray-600">
                Edit, delete or change visibility of your existing poems.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/">
          <Card hoverable className="h-full">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-purple-100 text-purple-800 mr-3">
                  <Eye size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">View Website</h3>
              </div>
              <p className="text-gray-600">
                Visit the public-facing website to see your published poems.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;