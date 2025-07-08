import { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../context/AuthContext';

import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';

const signUpStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F5F7', justifyContent: 'center' },
    content: { padding: 20 },
    title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 32, color: '#000', textAlign: 'center' },
    subtitle: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 40 },
    linkText: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: '#555', textAlign: 'center', marginTop: 20 },
    linkBold: { fontFamily: 'SpaceGrotesk-Bold' }
});

export default function SignUpScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Nuovo stato
    const [loading, setLoading] = useState(false);

    async function handleSignUp() {
        if (password !== confirmPassword) {
            Alert.alert("Errore", "Le password non coincidono.");
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert("Errore", error.message);
        } else {
            Alert.alert("Successo", "Controlla la tua email per il link di verifica!");
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={signUpStyles.container}>
            <View style={signUpStyles.content}>
                <Text style={signUpStyles.title}>Crea un Account</Text>
                <Text style={signUpStyles.subtitle}>Inizia la tua avventura con noi</Text>
                <AuthInput label="Email" value={email} onChangeText={setEmail} placeholder="tua@email.com" keyboardType="email-address" />
                <AuthInput 
                    label="Password" 
                    value={password} 
                    onChangeText={setPassword} 
                    placeholder="Crea una password sicura" 
                    secureTextEntry
                />
                <AuthInput 
                    label="Conferma Password" 
                    value={confirmPassword} 
                    onChangeText={setConfirmPassword} 
                    placeholder="Ripeti la password" 
                    secureTextEntry
                />
                <AuthButton title="Registrati" onPress={handleSignUp} loading={loading} />
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={signUpStyles.linkText}>Hai già un account? <Text style={signUpStyles.linkBold}>Accedi</Text></Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}