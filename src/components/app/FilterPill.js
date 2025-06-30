import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function FilterPill({ label, active, onPress }) {
    return (
        <TouchableOpacity style={[pillStyles.pill, active && pillStyles.activePill]} onPress={onPress}>
            <Text style={[pillStyles.label, active && pillStyles.activeLabel]}>{label}</Text>
        </TouchableOpacity>
    );
}

const pillStyles = StyleSheet.create({
    pill: { backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#E8E8E8' },
    activePill: { backgroundColor: '#007BFF', borderColor: '#007BFF' },
    label: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: '#333' },
    activeLabel: { color: '#FFFFFF', fontFamily: 'SpaceGrotesk-Bold' }
});
