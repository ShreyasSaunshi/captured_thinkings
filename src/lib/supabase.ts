import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client with additional options
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 
      'x-application-name': 'captured-thinkings',
      // Add CORS headers for local development
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Helper function to check connection with detailed error handling
export const checkSupabaseConnection = async () => {
  try {
    // Instead of checking the URL directly, try to make a simple query
    const { error } = await supabase
      .from('poems')
      .select('count')
      .limit(1)
      .single();
    
    if (error) {
      // Log specific error details for debugging
      console.error('Supabase query error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,});
      return false;
    }

    return true;
  } catch (err) {
    // Enhanced error logging
    console.error('Supabase connection error:', {
      error: err,
      message: err instanceof Error ? err.message : String(err),
      url: supabaseUrl,
      timestamp: new Date().toISOString()
    });

    if (err instanceof Error) {
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        cause: 'cause' in err ? err.cause : undefined
      });
    }
    return false;
  }
};

// Helper function to implement retry logic with exponential backoff
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxAttempts = 3,
  initialDelayMs = 1000
): Promise<T> => {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, lastError.message);
      
      // Log more details about the error
      if (err instanceof Error) {
        console.warn('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack,
          cause: 'cause' in err ? err.cause : undefined
        });
      }
      
      if (attempt < maxAttempts) {
        const delayMs = initialDelayMs * Math.pow(2, attempt - 1) * (0.5 + Math.random());
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError || new Error('Operation failed after all retry attempts');
};

// Debug helper to log Supabase operations
export const logSupabaseOperation = (operation: string, result: any) => {
  console.log(`Supabase ${operation} operation:`, {
    success: !result.error,
    data: result.data,
    error: result.error,
    timestamp: new Date().toISOString(),
    url: supabaseUrl // Log the URL being used
  });
};