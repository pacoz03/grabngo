import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = { text: '#555', title: '#000', subtle: '#8e8e93' };

export default function ProfileListItem({ item, type, onPress }) {
    const isNavigation = type === 'navigation';
    return (
        <TouchableOpacity style={itemStyles.container} disabled={!isNavigation} onPress={onPress}>
            <Ionicons name={item.icon} size={22} color={COLORS.subtle} style={itemStyles.icon}/>
            <View style={itemStyles.textContainer}><Text style={itemStyles.label}>{item.label}</Text>{item.value && <Text style={itemStyles.value}>{item.value}</Text>}</View>
            {isNavigation && <Ionicons name="chevron-forward" size={22} color={COLORS.subtle} />}
        </TouchableOpacity>
    );
}
const itemStyles = StyleSheet.create({ container: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }, icon: { width: 30, marginRight: 15 }, textContainer: { flex: 1 }, label: { fontSize: 16, fontFamily: 'SpaceGrotesk-Regular', color: COLORS.title }, value: { fontSize: 14, fontFamily: 'SpaceGrotesk-Regular', color: COLORS.subtle, marginTop: 2 } });
