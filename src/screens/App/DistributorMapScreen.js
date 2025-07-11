import React, { useState, useEffect, useRef } from 'react'; // <-- MODIFICATO: aggiunto useRef
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';
import * as Location from 'expo-location';

export default function DistributorMapScreen({ route, navigation }) {
    const { distributor: initialDistributor } = route.params;
    const [distributor, setDistributor] = useState(initialDistributor);
    const [loading, setLoading] = useState(false);

    // NUOVO: Aggiungi un ref per la MapView
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchDistributor = async () => {
            if (!initialDistributor || typeof initialDistributor.latitude !== 'number' || typeof initialDistributor.longitude !== 'number') {
                setLoading(true);
                try {
                    const { data, error } = await supabase
                        .from('distributors')
                        .select('*')
                        .eq('id', initialDistributor?.id || route.params?.distributorId)
                        .single();

                    if (error) {
                        console.error('Errore nel recupero del distributore:', error);
                        navigation.goBack();
                    } else if (data) {
                        setDistributor(data);
                    } else {
                        console.error('Nessun distributore trovato con ID:', initialDistributor?.id || route.params?.distributorId);
                        navigation.goBack();
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDistributor();
    }, [initialDistributor, navigation, route.params?.distributorId]);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permesso di accesso alla posizione negato');
                Alert.alert("Permesso Negato", "Per visualizzare la tua posizione sulla mappa, è necessario abilitare l'accesso alla posizione nelle impostazioni del dispositivo.");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'In attesa della posizione...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = 'Posizione ottenuta';
    }
    
    // NUOVO: Funzione per centrare la mappa sulla posizione dell'utente
    const centerOnUserLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permesso Negato", "Abilita l'accesso alla posizione per usare questa funzione.");
            return;
        }

        let currentUserLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentUserLocation); // Aggiorna la posizione del marker utente

        if (mapRef.current) {
            const userRegion = {
                latitude: currentUserLocation.coords.latitude,
                longitude: currentUserLocation.coords.longitude,
                latitudeDelta: 0.01, // Zoom simile a quello iniziale
                longitudeDelta: 0.01,
            };
            // Anima la mappa per centrarla sull'utente
            mapRef.current.animateToRegion(userRegion, 1000); // 1000ms di animazione
        }
    };


    const renderUserLocation = () => {
        if (location) {
            return (
                <Marker
                    coordinate={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    title="La tua posizione"
                    pinColor="blue" // Colore diverso per distinguere
                />
            );
        }
        return null;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (!distributor || typeof distributor.latitude !== 'number' || typeof distributor.longitude !== 'number') {
        return null;
    }

    const region = { latitude: distributor.latitude, longitude: distributor.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };

    return (<SafeAreaView style={styles.container} >

        {/* MODIFICATO: Aggiunto il ref alla MapView */}
        <MapView ref={mapRef} style={styles.map} initialRegion={region}>
            <Marker coordinate={{ latitude: distributor.latitude, longitude: distributor.longitude }} title={distributor.name} description={distributor.description} />
            {renderUserLocation()}
        </MapView>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>

        {/* NUOVO: Bottone per localizzare l'utente */}
        <TouchableOpacity style={styles.locateButton} onPress={centerOnUserLocation}>
            <Ionicons name="locate" size={24} color="#000" />
        </TouchableOpacity>

    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // NUOVO: Stile per il bottone di localizzazione
    locateButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});