import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../api/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false); // Nuovo stato per l'errore

  const fetchProfile = useCallback(async (user) => {
    if (!user) {
        setProfile(null);
        setProfileError(false);
        return;
    };
    
    setProfileError(false); // Resetta l'errore all'inizio di un nuovo fetch

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (error && error.code !== 'PGRST116') { // 'PGRST116' = no rows found
            throw error;
        }
        
        if (!data) {
            // Se non ci sono dati, significa che il profilo non esiste. Questo è un errore.
            throw new Error("Profilo non trovato per l'utente.");
        }

        setProfile(data);
    } catch (error) {
        console.error("Errore nel fetch del profilo:", error);
        setProfile(null);
        setProfileError(true); // Imposta lo stato di errore
    }
  }, []);

  useEffect(() => {
    const fetchInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session) {
            await fetchProfile(session.user);
        }
        setLoading(false);
    };
    
    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        await fetchProfile(session?.user);
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
    profileError, // Esponi lo stato di errore
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