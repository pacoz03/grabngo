import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FilterButton = ({ label }) => (
    <TouchableOpacity style={styles.button}>
        <Text style={styles.label}>{label}</Text>
        <Ionicons name="chevron-down" size={16} color="#555" />
    </TouchableOpacity>
);

export default function FilterButtons() {
    return (
        <View style={styles.container}>
            <FilterButton label="Categoria" />
            <FilterButton label="Distributore" />
            <FilterButton label="Prezzo" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#DDDDDD'
    },
    label: {
        fontSize: 14,
        marginRight: 5,
        color: '#333'
    },
    label: { fontSize: 14, marginRight: 5, color: '#333', fontFamily: 'SpaceGrotesk-Regular' }

});