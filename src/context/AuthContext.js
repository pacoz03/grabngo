import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../api/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (user) => {
    if (!user) return null;
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        if (error && error.code !== 'PGRST116') { // 'PGRST116' = no rows found
            throw error;
        }
        setProfile(data);
        console.log("Profile fetched:", data);
        return data;
    } catch (error) {
        console.error("Errore nel fetch del profilo:", error);
        setProfile(null);
        return null;
    }
  }, []);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
            await fetchProfile(session.user);
        }
        setLoading(false);
    };
    
    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
            await fetchProfile(session.user);
        } else {
            setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const value = {
    session,
    profile,
    loading,
    user: session?.user,
    signOut: () => supabase.auth.signOut(),
    refreshProfile: () => fetchProfile(session?.user),
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};