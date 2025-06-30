import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';
// Componenti
import SearchBar from '../../components/commons/SearchBar';
import ProductCard from '../../components/app/ProductCard';
import HomeOfferCard from '../../components/app/HomeOfferCard'; // <-- NUOVO IMPORT

const homeStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F5F7' },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontFamily: 'SpaceGrotesk-Bold', textAlign: 'center', color: '#000' },
  mapContainer: { marginHorizontal: 20, marginTop: 20, borderRadius: 15, overflow: 'hidden', height: 250, justifyContent: 'center', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  locateButton: { position: 'absolute', bottom: 15, right: 15, backgroundColor: '#FFF', borderRadius: 30, width: 50, height: 50, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  section: { marginTop: 30, marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontFamily: 'SpaceGrotesk-Bold', color: '#000', marginLeft: 20, marginBottom: 15 },
  loadingContainer: { height: 150, justifyContent: 'center', alignItems: 'center' },
});

export default function HomeScreen() {
  const navigation = useNavigation();
  const [markers, setMarkers] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]); // <-- Stato per le offerte
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true); // <-- Stato caricamento offerte
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => { await Location.requestForegroundPermissionsAsync(); })();

    async function fetchData() {
        // Carica Distributori
        supabase.from('distributors').select('id, name, description, latitude, longitude').then(({ data, error }) => {
            if (error) Alert.alert("Errore Mappa", "Impossibile caricare i distributori.");
            else if (data) {
                const formattedMarkers = data.map(d => ({ ...d, coordinate: { latitude: d.latitude, longitude: d.longitude }, title: d.name }));
                setMarkers(formattedMarkers);
            }
            setLoadingMap(false);
        });

        // Carica Prodotti
        supabase.from('products').select('*').limit(8).then(({ data, error }) => {
            if (error) Alert.alert("Errore Prodotti", "Impossibile caricare i prodotti.");
            else if (data) setProducts(data);
            setLoadingProducts(false);
        });

        // Carica Offerte
        supabase.from('offers').select('*').then(({ data, error }) => {
            if (error) Alert.alert("Errore Offerte", "Impossibile caricare le offerte.");
            else if (data) setOffers(data);
            setLoadingOffers(false);
        });
    }
    
    fetchData();
  }, []);

  const handleCenterOnUser = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation);
    mapRef.current?.animateToRegion({ latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
  };

  return (
    <SafeAreaView style={homeStyles.safeArea}>
      <ScrollView style={homeStyles.container} showsVerticalScrollIndicator={false}>
        <View style={homeStyles.header}><Text style={homeStyles.headerTitle}>Grab'n'Go</Text></View>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}><SearchBar editable={false} /></TouchableOpacity>
        
        <View style={homeStyles.mapContainer}>
            {loadingMap ? <ActivityIndicator size="large" color="#0000ff" /> : (
                <MapView ref={mapRef} style={homeStyles.map} initialRegion={{ latitude: 41.8719, longitude: 12.5674, latitudeDelta: 10, longitudeDelta: 10 }}>
                    {markers.map(marker => <Marker key={marker.id} coordinate={marker.coordinate} title={marker.title} description={marker.description} onPress={() => navigation.navigate('DistributorDetail', { distributor: marker })}/>)}
                    {location && <Marker coordinate={location.coords} title="La mia posizione" pinColor="blue" />}
                </MapView>
            )}
            <TouchableOpacity style={homeStyles.locateButton} onPress={handleCenterOnUser}><Ionicons name="locate" size={24} color="#000" /></TouchableOpacity>
        </View>

        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>Prodotti in Evidenza</Text>
          {loadingProducts ? <ActivityIndicator style={homeStyles.loadingContainer} /> : (
              <FlatList data={products} renderItem={({ item }) => <ProductCard product={item} />} keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }} />
          )}
        </View>
        
        <View style={homeStyles.section}>
          <Text style={homeStyles.sectionTitle}>Offerte per Te</Text>
          {loadingOffers ? <ActivityIndicator style={homeStyles.loadingContainer} /> : (
              <FlatList data={offers} renderItem={({ item }) => <HomeOfferCard offer={item} />} keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
