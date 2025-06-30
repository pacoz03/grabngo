import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native';

const authInputStyles = StyleSheet.create({
    container: { marginBottom: 20 },
    label: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: '#333', marginBottom: 8 },
    input: { backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E8E8E8', fontFamily: 'SpaceGrotesk-Regular', fontSize: 16 }
});

export default function AuthInput({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType }) {
    return (
        <View style={authInputStyles.container}>
            <Text style={authInputStyles.label}>{label}</Text>
            <TextInput
                style={authInputStyles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
        </View>
    );
}