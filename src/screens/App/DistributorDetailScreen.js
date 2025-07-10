import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, FlatList, TextInput, Keyboard, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../context/AuthContext'; // Import per ottenere l'utente
// Componenti
import FilterPill from '../../components/app/FilterPill';
import ProductGridItem from '../../components/app/ProductGridItem';
import ReviewItem from '../../components/app/ReviewItem';
import StarRatingInput from '../../components/app/StarRatingInput';

const detailStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F5F7' }, headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#F4F5F7' }, headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#000' }, headerImage: { width: '100%', height: 180 }, contentContainer: { paddingHorizontal: 20, paddingTop: 20 }, title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: '#000' }, description: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#333', marginVertical: 10 }, sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: '#000', marginTop: 20, marginBottom: 10 }, productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, buyButton: { backgroundColor: '#007BFF', padding: 15, borderRadius: 12, alignItems: 'center', marginVertical: 20 }, buyButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#FFF' }, reviewInputContainer: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#E8E8E8', marginBottom: 20 }, reviewInput: { height: 80, fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 8, padding: 10, marginTop: 15 }, sendButton: { backgroundColor: '#007BFF', padding: 12, borderRadius: 8, alignSelf: 'flex-end', marginTop: 10 }, sendButtonText: { fontFamily: 'SpaceGrotesk-Bold', color: '#FFF' },
    loadingContainer: { height: 100, justifyContent: 'center', alignItems: 'center' }
});

export default function DistributorDetailScreen({ route, navigation }) {
    const { distributor } = route.params;
    const { session } = useAuth(); // Ottieni la sessione utente
    const productFilters = ["Tutti", "Snacks", "Bevande", "Piatti", "Dolci", "Ingredienti"];
    
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Tutti');
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(0);

    useEffect(() => {
        async function fetchProductsAndReviews() {
            try {
                // Carica prodotti
                setLoadingProducts(true);
                const { data: productData, error: productError } = await supabase
                    .from('distributor_products')
                    .select('stock, products(*)')
                    .eq('distributor_id', distributor.id);
                if (productError) throw productError;
                if (productData) {
                    const availableProducts = productData.map(p => ({ ...p.products, stock: p.stock }));
                    setProducts(availableProducts);
                }

                // Carica recensioni
                setLoadingReviews(true);
                const { data: reviewData, error: reviewError } = await supabase
                    .from('reviews')
                    .select('*, profiles(full_name, avatar_url)')
                    .eq('distributor_id', distributor.id)
                    .order('created_at', { ascending: false });
                if (reviewError) throw reviewError;
                if (reviewData) setReviews(reviewData);

            } catch (error) {
                Alert.alert("Errore", "Impossibile caricare i dati del distributore.");
            } finally {
                setLoadingProducts(false);
                setLoadingReviews(false);
            }
        }
        fetchProductsAndReviews();
    }, [distributor.id]);

    const handleSendReview = async () => {
        if (!newReviewText.trim() || newReviewRating === 0 || !session?.user) {
            Alert.alert("Attenzione", "Devi inserire una valutazione e un commento per inviare la recensione.");
            return;
        }
        
        const { data, error } = await supabase
            .from('reviews')
            .insert([{
                user_id: session.user.id,
                distributor_id: distributor.id,
                rating: newReviewRating,
                comment: newReviewText,
            }])
            .select('*, profiles(full_name, avatar_url)')
            .single();

        if (error) {
            Alert.alert("Errore", "Impossibile salvare la recensione.");
        } else if (data) {
            setReviews(prevReviews => [data, ...prevReviews]);
            setNewReviewText('');
            setNewReviewRating(0);
            Keyboard.dismiss();
        }
    };

    const filteredProducts = activeFilter === 'Tutti'
        ? products
        : products.filter(p => p.category === activeFilter);

    return (
        <SafeAreaView style={detailStyles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={detailStyles.headerNav}>
                    <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#000" /></TouchableOpacity>
                    <Text style={detailStyles.headerTitle}>{distributor.name}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('DistributorMap', { distributor })}>
                        <Ionicons name="map-outline" size={24} color="#007BFF" />
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Image source={{ uri: 'https://placehold.co/600x300/c9e2b3/333?text=Delizie' }} style={detailStyles.headerImage} />
                    <View style={detailStyles.contentContainer}><Text style={detailStyles.title}>Delizie Mediterranee</Text><Text style={detailStyles.description}>Una selezione accurata di ingredienti mediterranei freschi e autentici, dagli oli d'oliva ai formaggi artigianali.</Text></View>
                    <View style={detailStyles.contentContainer}>
                        <Text style={detailStyles.sectionTitle}>Prodotti</Text>
                        <FlatList data={productFilters} renderItem={({ item }) => <FilterPill label={item} active={item === activeFilter} onPress={() => setActiveFilter(item)} />} keyExtractor={item => item} horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }} />
                        {loadingProducts ? <ActivityIndicator style={detailStyles.loadingContainer} /> : (
                            <View style={detailStyles.productGrid}>
                                {filteredProducts.map(item => <ProductGridItem key={item.id} product={item} />)}
                            </View>
                        )}
                    </View>
                    <View style={detailStyles.contentContainer}>
                        <TouchableOpacity style={detailStyles.buyButton} onPress={() => navigation.navigate('SelectQuantity', { distributor })}><Text style={detailStyles.buyButtonText}>Acquista Prodotti</Text></TouchableOpacity>
                        <Text style={detailStyles.sectionTitle}>Recensioni</Text>
                        {loadingReviews ? <ActivityIndicator style={detailStyles.loadingContainer} /> : (
                            reviews.map(review => <ReviewItem key={review.id} review={review} />)
                        )}
                        <Text style={detailStyles.sectionTitle}>Aggiungi Recensione</Text>
                        <View style={detailStyles.reviewInputContainer}>
                            <StarRatingInput rating={newReviewRating} onRatingChange={setNewReviewRating} />
                            <TextInput placeholder="Scrivi la tua recensione..." style={detailStyles.reviewInput} multiline value={newReviewText} onChangeText={setNewReviewText} />
                            <TouchableOpacity style={detailStyles.sendButton} onPress={handleSendReview}><Text style={detailStyles.sendButtonText}>Invia</Text></TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}