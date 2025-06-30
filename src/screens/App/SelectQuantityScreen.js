import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';
import { useCart } from '../../context/CartContext';
import FilterPill from '../../components/app/FilterPill';
import QuantitySelectorListItem from '../../components/app/QuantitySelectorListItem';

const COLORS = { background: '#F4F5F7', white: '#FFFFFF', text: '#333', title: '#000', primary: '#2E3A59', lightGray: '#F0F0F0' };

export default function SelectQuantityScreen({ route, navigation }) {
    const { distributor } = route.params;
    const { addItemsToCart } = useCart();
    
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('distributor_products')
                    .select('stock, products(*)')
                    .eq('distributor_id', distributor.id)
                    .gt('stock', 0);

                if (error) throw error;
                if (data) {
                    const availableProducts = data.map(p => ({ ...p.products, stock: p.stock }));
                    setProducts(availableProducts);
                }
            } catch (error) {
                Alert.alert("Errore", "Impossibile caricare i prodotti del distributore.");
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [distributor.id]);

    const handleQuantityChange = (productId, newQuantity) => {
        setQuantities(prev => ({...prev, [productId]: newQuantity}));
    };
    
    const totalPrice = useMemo(() => {
        return products.reduce((total, product) => {
            const quantity = quantities[product.id] || 0;
            return total + (parseFloat(product.price) * quantity);
        }, 0);
    }, [quantities, products]);

    const handleAddToCart = () => {
        const items = products.map(p => ({
            product: p,
            quantity: quantities[p.id] || 0,
        }));
        addItemsToCart(items, distributor);
        navigation.navigate('Carrello');
    };

    if (loading) {
        return <SafeAreaView style={quantityStyles.safeArea}><ActivityIndicator style={{ flex: 1 }} /></SafeAreaView>
    }

    return (
        <SafeAreaView style={quantityStyles.safeArea}>
            <View style={quantityStyles.headerNav}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.title} /></TouchableOpacity>
                <Text style={quantityStyles.headerTitle}>Seleziona la Quantità</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={products}
                renderItem={({ item }) => <QuantitySelectorListItem product={item} quantity={quantities[item.id] || 0} onQuantityChange={(newQuantity) => handleQuantityChange(item.id, newQuantity)}/>}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
            <View style={quantityStyles.footer}>
                <TouchableOpacity style={[quantityStyles.addToCartButton, totalPrice === 0 && quantityStyles.disabledButton]} disabled={totalPrice === 0} onPress={handleAddToCart}>
                    <Text style={quantityStyles.addToCartButtonText}>Aggiungi al carrello - €{totalPrice.toFixed(2)}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const quantityStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background }, headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: COLORS.background }, headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title }, footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: COLORS.lightGray }, addToCartButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center' }, addToCartButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: COLORS.white }, disabledButton: { backgroundColor: '#A9B0C3' }
});