import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CartItem from '../../components/app/CartItem';

const summaryStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' }, headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 }, headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#000' }, sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: '#000', marginTop: 10, marginBottom: 15 }, summaryContainer: { marginTop: 20, borderTopWidth: 1, borderColor: '#F0F0F0', paddingTop: 10 }, summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }, summaryLabel: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#555' }, summaryValue: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#555' }, divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 }, totalLabel: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#000' }, totalValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#000' }, footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#F0F0F0' }, actionButton: { backgroundColor: '#2E3A59', padding: 15, borderRadius: 12, alignItems: 'center' }, actionButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#FFFFFF' },
});

export default function OrderSummaryScreen({ route, navigation }) {
    const { cartItems, distributor, totalPrice } = route.params;

    const iva = totalPrice * 0.22;
    const finalTotal = totalPrice + iva;
    
    return (
        <SafeAreaView style={summaryStyles.safeArea}>
             <View style={summaryStyles.headerNav}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={'#000'} /></TouchableOpacity>
                <Text style={summaryStyles.headerTitle}>Riepilogo Acquisto</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => <CartItem item={item.product} quantity={item.quantity} isEditable={false} />}
                keyExtractor={item => item.product.id}
                ListHeaderComponent={<Text style={summaryStyles.sectionTitle}>Prodotti</Text>}
                ListFooterComponent={
                    <View style={summaryStyles.summaryContainer}>
                        <Text style={summaryStyles.sectionTitle}>Resoconto</Text>
                        <View style={summaryStyles.summaryRow}><Text style={summaryStyles.summaryLabel}>Subtotale</Text><Text style={summaryStyles.summaryValue}>€{totalPrice.toFixed(2)}</Text></View>
                        <View style={summaryStyles.summaryRow}><Text style={summaryStyles.summaryLabel}>IVA</Text><Text style={summaryStyles.summaryValue}>€{iva.toFixed(2)}</Text></View>
                        <View style={summaryStyles.divider} />
                        <View style={summaryStyles.summaryRow}><Text style={summaryStyles.totalLabel}>Totale</Text><Text style={summaryStyles.totalValue}>€{finalTotal.toFixed(2)}</Text></View>
                    </View>
                }
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            />
            <View style={summaryStyles.footer}>
                <TouchableOpacity style={summaryStyles.actionButton} onPress={() => navigation.navigate('Payment', { cartItems, distributor, finalTotal })}>
                    <Text style={summaryStyles.actionButtonText}>Procedi al Pagamento</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
