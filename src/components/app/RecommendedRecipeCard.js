import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

export default function RecommendedRecipeCard() {
    return (
        <TouchableOpacity style={recommendedStyles.card}>
            <View style={recommendedStyles.textContainer}>
                <Text style={recommendedStyles.title}>Dieta Mediterranea per Principianti</Text>
                <Text style={recommendedStyles.description}>Una guida per iniziare il tuo percorso con la dieta mediterranea.</Text>
                <TouchableOpacity style={recommendedStyles.button}>
                    <Text style={recommendedStyles.buttonText}>Visualizza</Text>
                </TouchableOpacity>
            </View>
            <Image source={{ uri: 'https://www.ricettamediterranea.it/wp-content/uploads/2016/09/PiramideDietaMediterranea.png' }} style={recommendedStyles.image} />
        </TouchableOpacity>
    );
}

const recommendedStyles = StyleSheet.create({
    card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#E8E8E8'},
    textContainer: { flex: 1, marginRight: 15 },
    title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#000' },
    description: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: '#666', marginVertical: 10 },
    button: { backgroundColor: '#F0F0F0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, alignSelf: 'flex-start' },
    buttonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: '#333' },
    image: { width: 100, height: 100, borderRadius: 10 }
});