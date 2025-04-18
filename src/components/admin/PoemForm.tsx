import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Toggle from '../ui/Toggle';
import { Poem, Language } from '../../types';

interface PoemFormProps {
  initialData?: Partial<Poem>;
  onSubmit: (data: Omit<Poem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  isLoading?: boolean;
}

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
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is modified
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
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Poem content is required';
    }
    
    if (!formData.coverImage.trim()) {
      newErrors.coverImage = 'Cover image URL is required';
    } else if (!formData.coverImage.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i)) {
      newErrors.coverImage = 'Please enter a valid image URL (jpg, jpeg, png, or webp)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
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
        label="Cover Image URL"
        name="coverImage"
        type="url"
        value={formData.coverImage}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
        fullWidth
        error={errors.coverImage}
        required
      />
      
      {formData.coverImage && (
        <div className="mt-2 mb-4">
          <p className="text-sm text-gray-600 mb-2">Cover Image Preview:</p>
          <div className="h-40 w-full overflow-hidden rounded-lg shadow-md">
            <img 
              src={formData.coverImage} 
              alt="Cover preview"
              className="w-full h-full object-cover" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x250?text=Invalid+Image+URL';
              }}
            />
          </div>
        </div>
      )}
      
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