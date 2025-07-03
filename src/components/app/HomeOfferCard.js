import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const COLORS = { white: '#FFFFFF', text: '#555', title: '#000' };

export default function HomeOfferCard({ offer }) {
    return (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: offer.image_url }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={2}>{offer.title}</Text>
                <Text style={styles.code}>Codice: {offer.code}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 160,
        marginRight: 15,
    },
    image: {
        width: 160,
        height: 160,
        borderRadius: 12,
    },
    textContainer: {
        padding: 12,
    },
    title: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 14,
        color: COLORS.title,
        marginBottom: 4,
    },
    code: {
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 11,
        color: COLORS.text,
    },
});