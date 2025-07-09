import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
    white: '#FFFFFF',
    border: '#EAEAEA',
    text: '#333',
    pointsBackground: '#FFF8E1',
    pointsText: '#FFA500',
};

const PointsBadge = ({ points, label, iconName = 'star' }) => {
    return (
        <View style={styles.badge}>
            <Text style={styles.labelText}>{label}</Text>
            <View style={styles.pointsContainer}>
                <Ionicons name={iconName} solid color={COLORS.pointsText} size={14} style={styles.icon} />
                <Text style={styles.pointsText}>{points}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    labelText: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Regular',
        color: COLORS.text,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: COLORS.pointsBackground,
        borderRadius: 20,
    },
    icon: {
        marginRight: 6,
    },
    pointsText: {
        fontSize: 16,
        fontFamily: 'SpaceGrotesk-Bold',
        color: COLORS.pointsText,
    },
});

export default PointsBadge;