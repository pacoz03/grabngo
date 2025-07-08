import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigation';
import CompleteProfileScreen from '../screens/App/CompleteProfileScreen';
import { ActivityIndicator, View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import LoginScreen from '../screens/App/LoginScreen';
import SignUpScreen from '../screens/App/SignUpScreen';

const Stack = createStackNavigator();

// Schermata di caricamento
const LoadingScreen = () => (
    <View style={navigatorStyles.loaderContainer}>
        <ActivityIndicator size="large" />
    </View>
);

export default function AppNavigator() {
  const { session, profile, loading, profileError, signOut } = useAuth();
  
  useEffect(() => {
    // Gestisce il caso in cui si verifichi un errore nel caricamento del profilo
    if (profileError) {
      Alert.alert(
        "Errore di Sincronizzazione",
        "Non è stato possibile caricare il tuo profilo. Prova ad accedere di nuovo.",
        [{ text: "OK", onPress: signOut }]
      );
    }
  }, [profileError, signOut]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {session && session.user ? (
        // L'utente è loggato. Se il profilo non è ancora stato caricato (ma non c'è errore),
        // mostra una schermata di caricamento per evitare sfarfallii.
        !profile ? (
            <Stack.Screen name="LoadingProfile" component={LoadingScreen} options={{ headerShown: false }} />
        ) : profile.full_name === 'Nuovo Utente' ? (
            <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} options={{ headerShown: false }}/>
        ) : (
            <Stack.Screen name="App" component={TabNavigator} options={{ headerShown: false }} />
        )
      ) : (
        // L'utente non è loggato
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
        </>
      )}
    </Stack.Navigator>
  );
}

const navigatorStyles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F5F7',
    }
});
