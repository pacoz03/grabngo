import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DistributorListItem({ distributor }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={distributorStyles.card} onPress={() => navigation.navigate('DistributorDetail', { distributor })}>
        <View style={distributorStyles.iconContainer}><Ionicons name="storefront-outline" size={24} color="#007BFF" /></View>
        <View style={distributorStyles.textContainer}>
            <Text style={distributorStyles.title}>{distributor.name}</Text>
            <Text style={distributorStyles.description}>{distributor.description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#8e8e93" />
    </TouchableOpacity>
  );
}
const distributorStyles = StyleSheet.create({ card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 15, marginHorizontal: 20, marginBottom: 10, borderWidth: 1, borderColor: '#E8E8E8' }, iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E7F2FF', justifyContent: 'center', alignItems: 'center', marginRight: 15, }, textContainer: { flex: 1, }, title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#000' }, description: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: '#666', marginTop: 2, } });