import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const cartItemColors = { text: '#555', title: '#000', lightGray: '#F0F0F0', primary: '#2E3A59' };

export default function CartItem({ item, quantity, onQuantityChange, isEditable = true }) {
    const itemTotalPrice = (parseFloat(item.price) * quantity).toFixed(2);
    return (
        <View style={cartItemStyles.container}>
            <Image source={{ uri: item.image_url }} style={cartItemStyles.image} />
            <View style={cartItemStyles.info}>
                <Text style={cartItemStyles.name}>{item.name}</Text>
                <Text style={cartItemStyles.price}>€{itemTotalPrice}</Text>
            </View>
            {isEditable ? (
                <View style={cartItemStyles.stepper}>
                    <TouchableOpacity onPress={() => onQuantityChange(quantity - 1)} style={cartItemStyles.button}>
                        <Ionicons name="remove-outline" size={20} color={cartItemColors.primary} />
                    </TouchableOpacity>
                    <Text style={cartItemStyles.quantity}>{quantity}</Text>
                    <TouchableOpacity onPress={() => onQuantityChange(quantity + 1)} style={cartItemStyles.button}>
                        <Ionicons name="add-outline" size={20} color={cartItemColors.primary} />
                    </TouchableOpacity>
                </View>
            ) : (
                <Text style={cartItemStyles.quantityDisplay}>x {quantity}</Text>
            )}
        </View>
    );
}
const cartItemStyles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderColor: cartItemColors.lightGray },
    image: { width: 50, height: 50, borderRadius: 8, marginRight: 15 },
    info: { flex: 1 },
    name: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: cartItemColors.title },
    price: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: cartItemColors.text, marginTop: 4 },
    stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: cartItemColors.lightGray, borderRadius: 20 },
    button: { padding: 8 },
    quantity: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: cartItemColors.primary, marginHorizontal: 12, minWidth: 20, textAlign: 'center' },
    quantityDisplay: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: cartItemColors.title, marginLeft: 10 }
});