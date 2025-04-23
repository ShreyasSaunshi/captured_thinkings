export type Language = 'english' | 'kannada';

export interface Poem {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage: string;
  language: Language;
  isListed: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}