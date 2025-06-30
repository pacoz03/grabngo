import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function AuthButton({ title, onPress, loading }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} disabled={loading}>
            {loading ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    button: { backgroundColor: '#2E3A59', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10 },
    text: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#FFF' }
});