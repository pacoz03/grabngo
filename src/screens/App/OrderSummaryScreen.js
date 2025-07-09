import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';
import CartItem from '../../components/app/CartItem';

const COLORS = { background: '#F4F5F7', white: '#FFFFFF', text: '#555', title: '#000', primary: '#2E3A59', lightGray: '#F0F0F0', success: '#28A745', danger: '#DC3545' };

export default function OrderSummaryScreen({ route, navigation }) {
    const { cartItems, distributor, totalPrice } = route.params;
    const [couponCode, setCouponCode] = useState('');
    const [loadingCoupon, setLoadingCoupon] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setLoadingCoupon(true);
        try {
            const { data, error } = await supabase.rpc('validate_coupon', { coupon_code: couponCode });
            if (error) throw error;

            setAppliedCoupon(data);
            if (data.discount_type === 'percentage') {
                setDiscount(totalPrice * (data.discount_value / 100.0));
            } else {
                setDiscount(data.discount_value);
            }
            Alert.alert("Successo", `Coupon "${data.title}" applicato!`);
        } catch (error) {
            Alert.alert("Errore Coupon", error.message);
            setAppliedCoupon(null);
            setDiscount(0);
        } finally {
            setLoadingCoupon(false);
        }
    };

    const iva = (totalPrice - discount) * 0.22;
    const finalTotal = totalPrice - discount + iva;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.title} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Riepilogo Acquisto</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => <CartItem item={item.product} quantity={item.quantity} isEditable={false} />}
                keyExtractor={item => item.product.id}
                ListHeaderComponent={<Text style={styles.sectionTitle}>Prodotti</Text>}
                ListFooterComponent={
                    <>
                        <View style={styles.couponContainer}>
                            <TextInput
                                style={styles.couponInput}
                                placeholder="Inserisci codice coupon"
                                value={couponCode}
                                onChangeText={setCouponCode}
                                autoCapitalize="characters"
                            />
                            <TouchableOpacity style={styles.applyButton} onPress={handleApplyCoupon} disabled={loadingCoupon}>
                                {loadingCoupon ? <ActivityIndicator color="#FFF" /> : <Text style={styles.applyButtonText}>Applica</Text>}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.summaryContainer}>
                            <Text style={styles.sectionTitle}>Resoconto</Text>
                            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotale</Text><Text style={styles.summaryValue}>€{totalPrice.toFixed(2)}</Text></View>
                            {discount > 0 && (
                                <View style={styles.summaryRow}>
                                    <Text style={[styles.summaryLabel, { color: COLORS.success }]}>Sconto ({appliedCoupon.title})</Text>
                                    <Text style={[styles.summaryValue, { color: COLORS.success }]}>- €{discount.toFixed(2)}</Text>
                                </View>
                            )}
                            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>IVA</Text><Text style={styles.summaryValue}>€{iva.toFixed(2)}</Text></View>
                            <View style={styles.divider} />
                            <View style={styles.summaryRow}><Text style={styles.totalLabel}>Totale</Text><Text style={styles.totalValue}>€{finalTotal.toFixed(2)}</Text></View>
                        </View>
                    </>
                }
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            />
            <View style={styles.footer}>
                {/* <-- MODIFICA APPLICATA QUI --> */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Payment', {
                        cartItems,
                        distributor,
                        finalTotal,
                        preTaxTotal: totalPrice - discount, // Aggiunto per il calcolo corretto dei punti
                        couponId: appliedCoupon?.id
                    })}
                >
                    <Text style={styles.actionButtonText}>Procedi al Pagamento</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white }, headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }, headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title }, sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: COLORS.title, marginTop: 10, marginBottom: 15 },
    couponContainer: { flexDirection: 'row', marginTop: 20 },
    couponInput: { flex: 1, borderWidth: 1, borderColor: COLORS.lightGray, paddingHorizontal: 15, borderRadius: 8, fontFamily: 'SpaceGrotesk-Regular', fontSize: 16 },
    applyButton: { backgroundColor: COLORS.primary, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginLeft: 10 },
    applyButtonText: { color: COLORS.white, fontFamily: 'SpaceGrotesk-Bold' },
    summaryContainer: { marginTop: 20, borderTopWidth: 1, borderColor: COLORS.lightGray, paddingTop: 10 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }, summaryLabel: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: COLORS.text }, summaryValue: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: COLORS.text }, divider: { height: 1, backgroundColor: COLORS.lightGray, marginVertical: 15 }, totalLabel: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title }, totalValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title }, footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: COLORS.lightGray }, actionButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center' }, actionButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: COLORS.white },
});