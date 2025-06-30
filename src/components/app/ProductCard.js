import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

export default function ProductCard({ product }) {
  return (
    // 1. Aggiunto un contenitore principale per la card e il testo
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <Image 
          source={{ uri: product.image_url }} 
          style={styles.image} 
          resizeMode="cover" 
        />
      </TouchableOpacity>
      <Text style={styles.name}>{product.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Stile per il nuovo contenitore principale
  container: {
    width: 130,
    marginRight: 15,
    alignItems: 'center', // Centra la card e il testo al suo interno
  },
  // La card ora contiene solo l'immagine
  card: {
    width: '100%',
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 7,
    elevation: 3,
    overflow: 'hidden', // Nasconde le parti dell'immagine che escono dai bordi arrotondati
    marginBottom: 8, // Aggiunge spazio tra la card e il testo del nome
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    paddingHorizontal: 5, 
    fontSize: 14,
   fontFamily: 'SpaceGrotesk-Bold',
    fontWeight: '600', 
    textAlign: 'center',
    color: '#333',
  },
});