import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigation';
import LoginScreen from '../screens/App/LoginScreen';
import SignUpScreen from '../screens/App/SignUpScreen';
import CompleteProfileScreen from '../screens/App/CompleteProfileScreen';
import { View, ActivityIndicator, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

// Schermata di caricamento
const LoadingScreen = () => (
    <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
    </View>
);

// Schermata di errore con opzione di logout
const AuthErrorScreen = () => {
    const { signOut } = useAuth();
    return (
        <View style={styles.loaderContainer}>
            <Text style={styles.errorText}>Impossibile caricare il profilo.</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutButtonText}>Esci</Text>
            </TouchableOpacity>
        </View>
    );
};

export default function AppNavigator() {
  const { session, profile, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {session && session.user ? (
        profile ? (
            profile.full_name === 'Nuovo Utente' ? (
                <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} options={{ headerShown: false }}/>
            ) : (
                <Stack.Screen name="App" component={TabNavigator} options={{ headerShown: false }} />
            )
        ) : (
            <Stack.Screen name="AuthError" component={AuthErrorScreen} options={{ headerShown: false }} />
        )
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
    loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F4F5F7' },
    errorText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#E53E3E', textAlign: 'center', marginBottom: 20 },
    logoutButton: { backgroundColor: '#2E3A59', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 8 },
    logoutButtonText: { fontFamily: 'SpaceGrotesk-Bold', color: '#FFF', fontSize: 16, }
});