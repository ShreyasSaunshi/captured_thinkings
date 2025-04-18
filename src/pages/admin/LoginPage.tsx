import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const success = await login(username, password);
      if (success) {
        navigate('/admin');
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
              <Lock className="text-white" size={28} />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600">
            Sign in to manage your poetry content
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              error={errors.username}
              fullWidth
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={errors.password}
              fullWidth
            />
            
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                isLoading={isLoading} 
                disabled={isLoading}
                fullWidth
              >
                Sign In
              </Button>
            </div>
            
            <div className="text-center mt-4 text-sm text-gray-600">
              <p>Demo credentials: username: admin, password: password</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;