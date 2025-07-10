import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { text: '#333', title: '#000', primary: '#2E3A59', lightGray: '#F0F0F0', white: '#FFFFFF', subtle: '#8e8e93' };

export default function QuantitySelectorListItem({ product, quantity, onQuantityChange }) {
    return (
        <View style={selectorStyles.container}>
            <Image source={{ uri: product.image_url }} style={selectorStyles.image} />
            <View style={selectorStyles.infoContainer}>
                <Text style={selectorStyles.name}>{product.name}</Text>
                <Text style={selectorStyles.stock}>{product.stock} disponibili</Text>
            </View>
            <View style={selectorStyles.stepper}>
                <TouchableOpacity onPress={() => onQuantityChange(Math.max(0, quantity - 1))} style={selectorStyles.button}>
                    <Ionicons name="remove" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={selectorStyles.quantity}>{quantity}</Text>
                <TouchableOpacity onPress={() => onQuantityChange(Math.min(product.stock, quantity + 1))} style={selectorStyles.button}>
                    <Ionicons name="add" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
const selectorStyles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 15, marginHorizontal: 20, marginBottom: 10, borderRadius: 12, borderWidth: 1, borderColor: COLORS.lightGray },
    image: { width: 50, height: 50, borderRadius: 8, marginRight: 15 },
    infoContainer: { flex: 1 },
    name: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: COLORS.title },
    stock: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 12, color: COLORS.subtle, marginTop: 2 },
    stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.lightGray, borderRadius: 20 },
    button: { padding: 8 },
    quantity: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: COLORS.primary, marginHorizontal: 12 }
});
