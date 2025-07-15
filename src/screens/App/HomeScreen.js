import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';
// Componenti
import SearchBar from '../../components/commons/SearchBar';
import ProductCard from '../../components/app/ProductCard';
import HomeOfferCard from '../../components/app/HomeOfferCard';
import { useAuth } from '../../context/AuthContext';
import PointsBadge from '../../components/app/PointsBadge';

const homeStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F5F7' },
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10, alignItems: 'center' },
    sectionTitle: { fontSize: 20, fontFamily: 'SpaceGrotesk-Bold', color: '#000', marginLeft: 20, marginBottom: 15 },
    headerTitle: { fontSize: 24, fontFamily: 'SpaceGrotesk-Bold', textAlign: 'center', color: '#000' },
    pointsSection: { paddingHorizontal: 20, marginTop: 20 },
    mapContainer: { marginHorizontal: 20, marginTop: 20, borderRadius: 15, overflow: 'hidden', height: 250, justifyContent: 'center', alignItems: 'center' },
    map: { ...StyleSheet.absoluteFillObject },
    locateButton: { position: 'absolute', bottom: 15, right: 15, backgroundColor: '#FFF', borderRadius: 30, width: 50, height: 50, justifyContent: 'center', alignItems: 'center', elevation: 5 },
    section: { marginTop: 20, marginBottom: 20 },
    sectionTitleContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
    resetButton: { backgroundColor: '#E8E8E8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    resetButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 12, color: '#333' },
    loadingContainer: { height: 150, justifyContent: 'center', alignItems: 'center' },
});
export default function HomeScreen() {
    const navigation = useNavigation();
    const [markers, setMarkers] = useState([]);
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loadingMap, setLoadingMap] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingOffers, setLoadingOffers] = useState(true);
    const [location, setLocation] = useState(null);
    const mapRef = useRef(null);
    const { session, profile, loading: authLoading } = useAuth();

    const fetchAllDistributors = useCallback(async () => {
        setLoadingMap(true);
        try {
            const { data, error } = await supabase.from('distributors').select('id, name, description, latitude, longitude');
            if (error) throw error;
            const formattedMarkers = (data || []).map(d => ({ ...d, coordinate: { latitude: d.latitude, longitude: d.longitude }, title: d.name }));
            setMarkers(formattedMarkers);
        } catch (error) {
            Alert.alert("Errore Mappa", "Impossibile caricare i distributori.");
        } finally {
            setLoadingMap(false);
        }
    }, []);

    const fetchDistributorsByProduct = useCallback(async (productId) => {
        setLoadingMap(true);
        try {
            const { data: distributorLinks, error: idsError } = await supabase
                .from('distributor_products')
                .select('distributor_id')
                .eq('product_id', productId);

            if (idsError) throw idsError;

            let distributorsData = [];
            if (distributorLinks && distributorLinks.length > 0) {
                const distributorIds = distributorLinks.map(link => link.distributor_id);
                const { data, error } = await supabase
                    .from('distributors')
                    .select('id, name, description, latitude, longitude')
                    .in('id', distributorIds);
                
                if (error) throw error;
                distributorsData = data || [];
            }
            
            const formattedMarkers = distributorsData.map(d => ({ ...d, coordinate: { latitude: d.latitude, longitude: d.longitude }, title: d.name }));
            setMarkers(formattedMarkers);
            fitMapToMarkers(formattedMarkers.map(m => m.id));

        } catch (error) {
            Alert.alert("Errore Mappa", "Impossibile caricare i distributori.");
            setMarkers([]);
        } finally {
            setLoadingMap(false);
        }
    }, []);

    useEffect(() => {
        fetchAllDistributors();
        (async () => { await Location.requestForegroundPermissionsAsync(); })();
        supabase.from('products').select('*').limit(8).then(({ data, error }) => {
            if (error) Alert.alert("Errore Prodotti", "Impossibile caricare i prodotti.");
            else if (data) setProducts(data);
            setLoadingProducts(false);
        });
        supabase.from('offers').select('*').eq('type', 'general').then(({ data, error }) => {
            if (error) Alert.alert("Errore Offerte", "Impossibile caricare le offerte.");
            else if (data) setOffers(data);
            setLoadingOffers(false);
        });
    }, [fetchAllDistributors]);

    const handleProductPress = (product) => {
        if (selectedProduct?.id === product.id) {
            setSelectedProduct(null);
            fetchAllDistributors();
        } else {
            setSelectedProduct(product);
            fetchDistributorsByProduct(product.id);
        }
    };

    const handleResetFilter = () => {
        setSelectedProduct(null);
        fetchAllDistributors();
    };

    const handleCenterOnUser = async () => {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        mapRef.current?.animateToRegion({ latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
    };

    const fitMapToMarkers = (markerIds) => {
        if (markerIds.length > 0 && mapRef.current) {
            mapRef.current.fitToSuppliedMarkers(markerIds, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    };

    return (
        <SafeAreaView style={homeStyles.safeArea}>
            <ScrollView style={homeStyles.container} showsVerticalScrollIndicator={false}>
                <View style={homeStyles.header}><Text style={homeStyles.headerTitle}>Grab'n'Go</Text></View>
                <TouchableOpacity onPress={() => navigation.navigate('Search')}><SearchBar editable={false} /></TouchableOpacity>
                {/* <-- AGGIUNTO: Sezione che mostra i punti dell'utente loggato --> */}
                {session && profile && (
                    <TouchableOpacity onPress={() => navigation.navigate('Profilo', { screen: 'Gamification' })}>
                        <View style={homeStyles.pointsSection}>
                            {authLoading ? (
                                <ActivityIndicator color="#0000ff" />
                            ) : (
                                <PointsBadge label="I tuoi punti" points={profile.points || 0} iconName="diamond" />
                            )}
                        </View>
                    </TouchableOpacity>
                )}
                {/* ... (Sezione Punti) */}
                <View style={homeStyles.mapContainer}>
                    {loadingMap ? <ActivityIndicator size="large" color="#0000ff" /> : (
                        <MapView ref={mapRef} style={homeStyles.map} initialRegion={{ latitude: 41.8719, longitude: 12.5674, latitudeDelta: 20, longitudeDelta: 20 }}>
                            {markers.map(marker => <Marker key={marker.id} coordinate={marker.coordinate} title={marker.title} description={marker.description} onPress={() => navigation.navigate('DistributorDetail', { distributor: marker })}/>)}
                            {location && <Marker coordinate={location.coords} title="La mia posizione" pinColor="blue" />}
                        </MapView>
                    )}
                    <TouchableOpacity style={homeStyles.locateButton} onPress={handleCenterOnUser}><Ionicons name="locate" size={24} color="#000" /></TouchableOpacity>
                </View>

                <View style={homeStyles.section}>
                        <Text style={homeStyles.sectionTitle}>Prodotti in Evidenza</Text>
                        {selectedProduct && (
                            <TouchableOpacity style={homeStyles.resetButton} onPress={handleResetFilter}>
                                <Text style={homeStyles.resetButtonText}>Mostra tutti</Text>
                            </TouchableOpacity>
                        )}
                    {loadingProducts ? <ActivityIndicator style={homeStyles.loadingContainer} /> : (
                        <FlatList data={products} renderItem={({ item }) => <ProductCard product={item} onPress={() => handleProductPress(item)} isSelected={selectedProduct?.id === item.id} />} keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }} />
                    )}
                </View>
                
                {/* ... (Sezione Offerte) */}
                <View style={[homeStyles.section, { marginTop: 10 }]}>
                    <Text style={homeStyles.sectionTitle}>Offerte per Te</Text>
                    {loadingOffers ? <ActivityIndicator style={homeStyles.loadingContainer} /> : (
                        <FlatList
                            data={offers}
                            renderItem={({ item }) => (
                                <View pointerEvents="none">
                                    <HomeOfferCard offer={item} />
                                </View>
                            )}
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingLeft: 20 }}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}