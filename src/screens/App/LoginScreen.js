import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../api/supabase';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

const loginStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F5F7', justifyContent: 'center' },
    content: { padding: 20 },
    title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 32, color: '#000', textAlign: 'center' },
    subtitle: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 40 },
    linkText: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: '#555', textAlign: 'center', marginTop: 20 },
    linkBold: { fontFamily: 'SpaceGrotesk-Bold' }
});

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert("Errore", error.message);
        setLoading(false);
    }

    return (
        <SafeAreaView style={loginStyles.container}>
            <View style={loginStyles.content}>
                <Text style={loginStyles.title}>Bentornato!</Text>
                <Text style={loginStyles.subtitle}>Accedi per continuare</Text>

                <AuthInput label="Email" value={email} onChangeText={setEmail} placeholder="tua@email.com" keyboardType="email-address" />
                <AuthInput label="Password" value={password} onChangeText={setPassword} placeholder="La tua password" secureTextEntry />
                
                <AuthButton title="Accedi" onPress={handleLogin} loading={loading} />

                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={loginStyles.linkText}>Non hai un account? <Text style={loginStyles.linkBold}>Registrati</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
