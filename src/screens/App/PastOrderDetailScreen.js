import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';
import CartItem from '../../components/app/CartItem';

const COLORS = { background: '#F4F5F7', white: '#FFFFFF', text: '#555', title: '#000', primary: '#2E3A59', lightGray: '#F0F0F0' };

export default function PastOrderDetailScreen({ route, navigation }) {
    const { order } = route.params;
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrderItems() {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('order_items')
                    .select('quantity, price_at_purchase, products(*)')
                    .eq('order_id', order.id);

                if (error) throw error;
                if (data) {
                    const items = data.map(item => ({
                        ...item.products,
                        quantity: item.quantity,
                        price: item.price_at_purchase,
                    }));
                    setOrderItems(items);
                    console.log("Order Items:", items);
                }
            } catch (error) {
                 Alert.alert("Errore", "Impossibile caricare i dettagli dell'ordine.");
            } finally {
                setLoading(false);
            }
        }
        fetchOrderItems();
    }, [order.id]);
    
    const iva = order.total_price * 0.22;
    const finalTotal = parseFloat(order.total_price) + iva;

    return (
        <SafeAreaView style={styles.safeArea}>
             <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.title} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Riepilogo Ordine</Text>
                <View style={{ width: 24 }} />
            </View>
            {loading ? <ActivityIndicator style={{flex: 1}}/> : (
                <FlatList
                    data={orderItems}
                    renderItem={({ item }) => <CartItem item={item} quantity={item.quantity} isEditable={false} />}
                    keyExtractor={item => item.id}
                    ListHeaderComponent={<Text style={styles.sectionTitle}>Prodotti</Text>}
                    ListFooterComponent={
                        <View style={styles.summaryContainer}>
                            <Text style={styles.sectionTitle}>Resoconto</Text>
                            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotale</Text><Text style={styles.summaryValue}>€{parseFloat(order.total_price).toFixed(2)}</Text></View>
                            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>IVA</Text><Text style={styles.summaryValue}>€{iva.toFixed(2)}</Text></View>
                            <View style={styles.divider} />
                            <View style={styles.summaryRow}><Text style={styles.totalLabel}>Totale</Text><Text style={styles.totalValue}>€{finalTotal.toFixed(2)}</Text></View>
                        </View>
                    }
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                />
            )}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('OrderConfirmation', { orderId: order.id, isPastOrder: true })}>
                    <Text style={styles.actionButtonText}>QR Code</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white }, 
    headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 }, 
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title }, 
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: COLORS.title, marginTop: 10, marginBottom: 15 }, 
    summaryContainer: { marginTop: 20, borderTopWidth: 1, borderColor: COLORS.lightGray, paddingTop: 10 }, 
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }, 
    summaryLabel: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: COLORS.text }, 
    summaryValue: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: COLORS.text }, 
    divider: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: 15 }, 
    totalLabel: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title }, 
    totalValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title }, 
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: COLORS.lightGray }, 
    actionButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center' }, 
    actionButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: COLORS.white }
});