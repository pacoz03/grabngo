import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

export default function RecipeCard({ recipe }) {
    return (
        <TouchableOpacity style={recipeCardStyles.card}>
            <Image source={{ uri: recipe.image_url }} style={recipeCardStyles.image} />
            <Text style={recipeCardStyles.title}>{recipe.title}</Text>
            <Text style={recipeCardStyles.description} numberOfLines={2}>{recipe.description}</Text>
        </TouchableOpacity>
    );
}


const recipeCardStyles = StyleSheet.create({
    card: { width: 220, marginRight: 15, backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden' },
    image: { width: '100%', height: 120 },
    title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, marginHorizontal: 10, marginTop: 10, color: '#000' },
    description: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 12, marginHorizontal: 10, marginVertical: 5, color: '#666' }
});