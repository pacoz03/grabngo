
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
    label: {fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: '#333', marginBottom: 8,},
});

export default function CompleteProfileScreen() {
    const { user, refreshProfile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [dietPreference, setDietPreference] = useState('Nessuna');
    const [showDietOptions, setShowDietOptions] = useState(false);
    const dietOptions = ['Nessuna','Vegana', 'Vegetariana', 'Senza Lattosio', 'Senza Glutine'];
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
                .update({ full_name: fullName, diet_preference: dietPreference })
                .eq('id', user.id);

            if (error) throw error;
            await refreshProfile();
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
                <Text style={completeProfileStyles.label}>Tipologia di Dieta</Text>

                <View style={{ marginBottom: 24 }}>
                    <TouchableOpacity
                        onPress={() => setShowDietOptions(!showDietOptions)}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            paddingVertical: 14,
                            borderWidth: 1,
                            borderColor: '#ccc'
                        }}
                    >
                        <Text style={{ fontSize: 16, color: dietPreference ? '#000' : '#aaa' }}>
                            {dietPreference || 'Seleziona...'}
                        </Text>
                    </TouchableOpacity>

                    {showDietOptions && (
                        <View style={{
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 8,
                            marginTop: 8
                        }}>
                            {dietOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => {
                                        setDietPreference(option);
                                        setShowDietOptions(false);
                                    }}
                                    style={{ paddingVertical: 12, paddingHorizontal: 12 }}
                                >
                                    <Text style={{ fontSize: 16 }}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                <AuthButton title="Salva e Continua" onPress={handleCompleteProfile} loading={loading} />
            </View>
        </SafeAreaView>
    );
}
