import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AuthInput({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    secureTextEntry={!isPasswordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize="none"
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.icon}>
                        <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color="#8e8e93" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { marginBottom: 20 },
    label: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: '#333', marginBottom: 8 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 16
    },
    icon: {
        padding: 10,
    }
});
