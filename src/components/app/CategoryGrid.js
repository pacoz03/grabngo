import React from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity } from 'react-native';

const mockCategories = [
    { id: '1', name: 'Snacks', image: 'https://placehold.co/150x100/a3e6bd/333?text=Snacks' },
    { id: '2', name: 'Bevande', image: 'https://placehold.co/150x100/a5f3fc/333?text=Bevande' },
    { id: '3', name: 'Piatti', image: 'https://placehold.co/150x100/fecaca/333?text=Piatti' },
    { id: '4', name: 'Dolci', image: 'https://placehold.co/150x100/fde68a/333?text=Dolci' },
    { id: '5', name: 'Ingredienti', image: 'https://placehold.co/150x100/d1d5db/333?text=Ingredienti' },
    { id: '6', name: 'Supplementi', image: 'https://placehold.co/150x100/c7d2fe/333?text=Supplementi' },
];

const CategoryCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
);

export default function CategoryGrid() {
    return (
        <FlatList
            data={mockCategories}
            renderItem={({ item }) => <CategoryCard item={item} />}
            keyExtractor={item => item.id}
            numColumns={2}
            style={styles.container}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        marginTop: 10,
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
        margin: 8,
        height: 120,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#E8E8E8'
    },
    image: {
        width: 60,
        height: 50,
        borderRadius: 8,
        marginBottom: 10,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: '#333'
    },
});