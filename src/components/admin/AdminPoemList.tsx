import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Edit, Trash } from 'lucide-react';
import { Poem } from '../../types';
import Button from '../ui/Button';

interface AdminPoemListProps {
  poems: Poem[];
  onToggleVisibility: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const AdminPoemList: React.FC<AdminPoemListProps> = ({
  poems,
  onToggleVisibility,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Loading poems...</p>
      </div>
    );
  }
  
  if (poems.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No poems found.</p>
        <Link to="/admin/upload" className="mt-4 inline-block text-blue-900 hover:underline">
          + Add a new poem
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Language
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {poems.map((poem) => {
            const date = new Date(poem.createdAt);
            const formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            
            return (
              <tr key={poem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={poem.coverImage} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{poem.title}</div>
                      {poem.subtitle && (
                        <div className="text-sm text-gray-500">{poem.subtitle}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${poem.language === 'english' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                    {poem.language === 'english' ? 'English' : 'ಕನ್ನಡ'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${poem.isListed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {poem.isListed ? 'Published' : 'Unlisted'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formattedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onToggleVisibility(poem.id)}
                      className={`p-1 rounded-full ${
                        poem.isListed 
                          ? 'text-green-500 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={poem.isListed ? 'Unlist poem' : 'Publish poem'}
                    >
                      {poem.isListed ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <Link
                      to={`/admin/edit/${poem.id}`}
                      className="p-1 rounded-full text-blue-500 hover:bg-blue-50"
                      title="Edit poem"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => onDelete(poem.id)}
                      className="p-1 rounded-full text-red-500 hover:bg-red-50"
                      title="Delete poem"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPoemList;