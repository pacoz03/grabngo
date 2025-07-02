
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../api/supabase';
 import { useAuth } from '../../context/AuthContext';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

const completeProfileStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F5F7', justifyContent: 'center' },
    content: { padding: 20 },
    title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 32, color: '#000', textAlign: 'center' },
    subtitle: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 40 },
});

export default function CompleteProfileScreen() {
    const { user, refreshProfile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleCompleteProfile() {
        if (!fullName.trim()) {
            Alert.alert("Attenzione", "Per favore, inserisci il tuo nome.");
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: fullName })
                .eq('id', user.id);

            if (error) throw error;

            // L'aggiornamento ha successo, ricarica il profilo.
            // L'onAuthStateChange nel context rileverà il cambiamento e
            // il navigatore si aggiornerà automaticamente.
            await refreshProfile();
            // Non c'è bisogno di setLoading(false) qui perché il componente
            // verrà smontato dalla navigazione.
        } catch (error) {
            Alert.alert("Errore", error.message);
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={completeProfileStyles.container}>
            <View style={completeProfileStyles.content}>
                <Text style={completeProfileStyles.title}>Ultimo passo!</Text>
                <Text style={completeProfileStyles.subtitle}>Inserisci il tuo nome per completare il profilo.</Text>
                <AuthInput label="Nome Completo" value={fullName} onChangeText={setFullName} placeholder="Mario Rossi" />
                <AuthButton title="Salva e Continua" onPress={handleCompleteProfile} loading={loading} />
            </View>
        </SafeAreaView>
    );
}
