import 'react-native-url-polyfill/auto'; // Risolve un problema comune di compatibilità
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// createClient accetta un terzo parametro opzionale per gestire la sessione
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Usa AsyncStorage per salvare la sessione dell'utente sul dispositivo
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


