import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function StarRatingInput({ rating, onRatingChange, size = 30 }) {
    return (
        <View style={styles.container}>
            {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                    <TouchableOpacity key={starValue} onPress={() => onRatingChange(starValue)}>
                        <Ionicons
                            name={starValue <= rating ? "star" : "star-outline"}
                            size={size}
                            color={starValue <= rating ? '#FFC700' : '#E0E0E0'}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});