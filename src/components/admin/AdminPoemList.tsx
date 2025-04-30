import React from 'react';
import { Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { Poem } from '../../types';

interface AdminPoemListProps {
  poems: Poem[];
  isLoading: boolean;
  onToggleVisibility: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onDelete: (id: string) => void;
}

const AdminPoemList: React.FC<AdminPoemListProps> = ({
  poems,
  isLoading,
  onToggleVisibility,
  onToggleFeatured,
  onDelete,
}) => {
  if (isLoading) {
    return <p>Loading poems...</p>;
  }

  if (!poems.length) {
    return <p>No poems found.</p>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm text-left table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="px-4 py-2 min-w-[180px]">Title</th>
            <th className="px-4 py-2 min-w-[120px]">Author</th>
            <th className="px-4 py-2 min-w-[140px]">Date</th>
            <th className="px-4 py-2 min-w-[100px]">Visibility</th>
            <th className="px-4 py-2 min-w-[100px]">Featured</th>
            <th className="px-4 py-2 min-w-[150px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {poems.map((poem) => (
            <tr key={poem.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{poem.title}</td>
              <td className="px-4 py-2">{poem.author}</td>
              <td className="px-4 py-2">{new Date(poem.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onToggleVisibility(poem.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {poem.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onToggleFeatured(poem.id)}
                  className={`hover:text-yellow-500 ${
                    poem.featured ? 'text-yellow-500' : 'text-gray-500'
                  }`}
                >
                  <Star size={18} />
                </button>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onDelete(poem.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPoemList;
