import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const ingredientStyles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    image: { width: 40, height: 40, borderRadius: 8, marginRight: 15 },
    name: { flex: 1, fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#333' },
    quantity: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#000' }
});

export default function IngredientListItem({ ingredient }) {
    return (
        <View style={ingredientStyles.container}>
            <Image source={{ uri: ingredient.products.image_url }} style={ingredientStyles.image} />
            <Text style={ingredientStyles.name}>{ingredient.products.name}</Text>
            <Text style={ingredientStyles.quantity}>{ingredient.quantity_needed}</Text>
        </View>
    );
}