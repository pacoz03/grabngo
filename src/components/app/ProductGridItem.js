import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 30;

export default function ProductGridItem({ product }) {
    return (
        <TouchableOpacity style={[gridStyles.card, { width: cardWidth }]}>
            <Image source={{ uri: product.image_url }} style={gridStyles.image} />
            <Text style={gridStyles.name}>{product.name}</Text>

            {/* 👇 La modifica è qui 👇 */}
            <Text
                style={[
                    gridStyles.availability,
                    product.stock > 0 ? gridStyles.available : gridStyles.unavailable
                ]}
            >
                {product.stock > 0 ? 'Disponibile' : 'Esaurito'}
            </Text>

            <Text style={gridStyles.price}>€{product.price}</Text>
        </TouchableOpacity>
    );
}

const gridStyles = StyleSheet.create({
    card: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 15, padding: 10, alignItems: 'center' },
    image: { width: '100%', height: 100, borderRadius: 8, marginBottom: 10 },
    name: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#000' },

    // Stile base per la disponibilità (senza colore)
    availability: {
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 12,
        marginVertical: 2
    },
    // Stile per il colore verde
    available: {
        color: '#28a745',
    },
    // Stile per il colore rosso
    unavailable: {
        color: '#dc3545',
    },

    price: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: '#333' }
});