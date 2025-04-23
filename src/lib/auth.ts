import Cookies from 'js-cookie';
import { supabase } from './supabase';

const SESSION_COOKIE = 'sb-session';
const LAST_ACTIVITY = 'last-activity';
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export const updateLastActivity = () => {
  localStorage.setItem(LAST_ACTIVITY, Date.now().toString());
};

export const checkInactivity = () => {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY);
  if (!lastActivity) return true;

  const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
  return timeSinceLastActivity > INACTIVITY_TIMEOUT;
};

export const setSessionCookie = (session: any) => {
  if (!session) {
    removeSessionCookie();
    return;
  }
  
  Cookies.set(SESSION_COOKIE, JSON.stringify(session), {
    expires: 1/24, // 1 hour
    secure: true,
    sameSite: 'strict'
  });
  updateLastActivity();
};

export const getSessionCookie = () => {
  const sessionStr = Cookies.get(SESSION_COOKIE);
  if (!sessionStr) return null;
  
  try {
    const session = JSON.parse(sessionStr);
    if (checkInactivity()) {
      removeSessionCookie();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const removeSessionCookie = () => {
  Cookies.remove(SESSION_COOKIE);
  localStorage.removeItem(LAST_ACTIVITY);
};

export const checkSession = async () => {
  try {
    if (checkInactivity()) {
      removeSessionCookie();
      return null;
    }

    const cookieSession = getSessionCookie();
    if (cookieSession) {
      const expiresAt = new Date(cookieSession.expires_at).getTime();
      if (Date.now() < expiresAt) {
        updateLastActivity();
        return cookieSession;
      }
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      removeSessionCookie();
      return null;
    }
    
    setSessionCookie(session);
    return session;
  } catch (err) {
    console.error('Check session error:', err);
    removeSessionCookie();
    return null;
  }
};

export const refreshSession = async () => {
  try {
    if (checkInactivity()) {
      removeSessionCookie();
      return null;
    }

    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error || !session) {
      removeSessionCookie();
      return null;
    }
    
    setSessionCookie(session);
    return session;
  } catch (err) {
    console.error('Refresh session error:', err);
    removeSessionCookie();
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    if (!session) throw new Error('No session returned after login');
    
    setSessionCookie(session);
    updateLastActivity();
    return session;
  } catch (error) {
    removeSessionCookie();
    throw error;
  }
};

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } finally {
    removeSessionCookie();
  }
};