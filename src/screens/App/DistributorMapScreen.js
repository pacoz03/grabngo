import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function DistributorMapScreen({ route, navigation }) {
    const { distributor } = route.params;
    const region = {
        latitude: distributor.latitude,
        longitude: distributor.longitude,
        latitudeDelta: 0.01, // Zoom più ravvicinato
        longitudeDelta: 0.01,
    };

    return (
        <SafeAreaView style={styles.container}>
            <MapView style={styles.map} initialRegion={region}>
                <Marker
                    coordinate={{ latitude: distributor.latitude, longitude: distributor.longitude }}
                    title={distributor.name}
                    description={distributor.description}
                />
            </MapView>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={28} color="#000" />
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
});