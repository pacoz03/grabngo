import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const COLORS = { white: '#FFFFFF', title: '#000', text: '#333', primary: '#2F80ED', primary_light: '#E5EAFD', border: '#E8E8E8' };

export default function RecommendedRecipeCard({ onPress }) {
    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    Dieta Mediterranea per Principianti
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                    Una guida per iniziare il tuo percorso con la dieta mediterranea.
                </Text>

                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>Visualizza</Text>
                </TouchableOpacity>
            </View>
            <Image
                source={{ uri: 'https://www.ricettamediterranea.it/wp-content/uploads/2016/09/PiramideDietaMediterranea.png' }}
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border
    },
    textContainer: {
        flex: 1,
        marginRight: 15
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
        marginBottom: 15,
    },
    button: {
        backgroundColor: COLORS.primary_light,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    buttonText: {
        fontWeight: '600',
        color: COLORS.primary,
        fontSize: 13,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10
    }
});