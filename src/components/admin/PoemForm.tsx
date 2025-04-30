import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import { Poem } from '../../types';
import { supabase } from '../../lib/supabase';

interface PoemFormProps {
  initialData?: Partial<Poem>;
  onSubmit: (data: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

const DEFAULT_IMAGE = 'https://via.placeholder.com/600x400?text=Nature+Poem+Cover';

const PoemForm: React.FC<PoemFormProps> = ({
  initialData = {},
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    subtitle: initialData.subtitle || '',
    content: initialData.content || '',
    coverImage: initialData.coverImage || '',
    language: initialData.language || 'english',
    isListed: initialData.isListed !== undefined ? initialData.isListed : true,
    isFeatured: initialData.isFeatured !== undefined ? initialData.isFeatured : false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isListed: checked }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { error } = await supabase.storage
      .from('poem-covers')
      .upload(filePath, file);

    if (error) {
      console.error('Upload failed:', error);
      setErrors(prev => ({ ...prev, coverImage: 'Upload failed. Try again.' }));
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('poem-covers')
      .getPublicUrl(filePath);

    setFormData(prev => ({
      ...prev,
      coverImage: publicUrlData?.publicUrl || '',
    }));

    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.coverImage;
      return newErrors;
    });

    setUploading(false);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Poem content is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const coverImage = formData.coverImage.trim()
        ? formData.coverImage
        : DEFAULT_IMAGE;

      onSubmit({ ...formData, coverImage });
    }
  };

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'kannada', label: 'Kannada (ಕನ್ನಡ)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter the poem title"
        fullWidth
        error={errors.title}
        required
      />

      <Input
        label="Subtitle (optional)"
        name="subtitle"
        value={formData.subtitle}
        onChange={handleChange}
        placeholder="Enter a subtitle or brief description"
        fullWidth
      />

      <Input
        label="Cover Image URL (optional)"
        name="coverImage"
        type="url"
        value={formData.coverImage}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
        fullWidth
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Or Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
        {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
      </div>

      <div className="mt-2 mb-4">
        <p className="text-sm text-gray-600 mb-2">Cover Image Preview:</p>
        <div className="h-40 w-full overflow-hidden rounded-lg shadow-md">
          <img
            src={formData.coverImage || DEFAULT_IMAGE}
            alt="Cover preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
            }}
          />
        </div>
      </div>

      <Select
        label="Language"
        name="language"
        value={formData.language}
        onChange={handleChange}
        options={languageOptions}
        fullWidth
        required
      />

      <TextArea
        label="Poem Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Enter the poem text here..."
        rows={10}
        fullWidth
        error={errors.content}
        required
        className={formData.language === 'kannada' ? 'font-kannada' : ''}
      />

      <div className="flex items-center justify-between pt-2">
        <Toggle
          label="Publish on website"
          checked={formData.isListed}
          onChange={handleToggleChange}
          id="isListed"
        />

        <div className="flex space-x-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {initialData.id ? 'Update Poem' : 'Create Poem'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PoemForm;
