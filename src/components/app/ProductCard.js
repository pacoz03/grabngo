import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

export default function ProductCard({ product, onPress, isSelected }) {
 return (
   <TouchableOpacity style={styles.container} onPress={onPress}>
     <View style={[styles.card, isSelected && styles.selectedCard]}>
       <Image 
         source={{ uri: product.image_url }} 
         style={styles.image} 
         resizeMode="cover" 
       />
     </View>
     <Text style={styles.name}>{product.name}</Text>
   </TouchableOpacity>
 );
}

const styles = StyleSheet.create({
 container: {
   width: 130,
   marginRight: 15,
   alignItems: 'center',
 },
 card: {
   width: '100%',
   height: 120,
   backgroundColor: '#FFFFFF',
   borderRadius: 7,
   elevation: 3,
   overflow: 'hidden',
   marginBottom: 8,
   borderWidth: 2,
   borderColor: 'transparent',
 },
 selectedCard: {
    borderColor: '#007BFF',
 },
 image: {
   width: '100%',
   height: '100%',
 },
 name: {
   paddingHorizontal: 5, 
   fontSize: 14,
   fontFamily: 'SpaceGrotesk-Bold',
   textAlign: 'center',
   color: '#333',
 },
});