import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const COLORS = { white: '#FFFFFF', text: '#555', title: '#000', expiry: '#E53E3E' };

export default function PersonalizedOfferCard({ offer }) {
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.textContainer}>
                {offer.expiry && <Text style={styles.expiry}>{offer.expiry}</Text>}
                <Text style={styles.title}>{offer.title}</Text>
                <Text style={styles.description}>{offer.description}</Text>
            </View>
            <Image source={{ uri: offer.image }} style={styles.image} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
        padding: 15,
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginRight: 15,
    },
    expiry: {
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 12,
        color: COLORS.expiry,
        marginBottom: 5,
    },
    title: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 18,
        color: COLORS.title,
        marginBottom: 5,
    },
    description: {
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 20,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
});