import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const COLORS = { white: '#FFFFFF', text: '#555', title: '#000' };

export default function OfferCard({ offer }) {
    return (
        <TouchableOpacity style={styles.card}>
            <Image source={{ uri: offer.image }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>{offer.title}</Text>
                <Text style={styles.code}>Codice: {offer.code}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 250,
        marginRight: 15,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    image: {
        width: '100%',
        height: 140,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    textContainer: {
        padding: 15,
    },
    title: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 16,
        color: COLORS.title,
        marginBottom: 5,
    },
    code: {
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 14,
        color: COLORS.text,
    },
});