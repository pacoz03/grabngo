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
        backgroundColor: COLORS.white,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
    },
    image: {
        width: '100%',
        height: 100,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
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
        fontSize: 12,
        color: COLORS.text,
    },
});