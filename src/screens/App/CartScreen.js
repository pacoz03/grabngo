import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import CartItem from '../../components/app/CartItem';

const COLORS = { background: '#F4F5F7', white: '#FFFFFF', text: '#555', title: '#000', primary: '#2E3A59', lightGray: '#F0F0F0' };

export default function CartScreen({ navigation }) {
    const { cartItems, distributor, totalPrice, updateItemQuantity } = useCart();

    const iva = totalPrice * 0.22;
    const finalTotal = totalPrice + iva;
    
    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerNav}><Text style={styles.headerTitle}>Carrello</Text></View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Il tuo carrello è vuoto.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const renderHeader = () => (
        <>
            <View style={styles.distributorCard}>
                <Text style={styles.distributorTitle}>Acquisto da:</Text>
                <Text style={styles.distributorName}>{distributor.name}</Text>
                <Text style={styles.distributorDescription}>{distributor.description}</Text>
            </View>
            <Text style={styles.sectionTitle}>Prodotti</Text>
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
             <View style={styles.headerNav}><Text style={styles.headerTitle}>Carrello</Text></View>
            <FlatList
                data={cartItems}
                renderItem={({ item }) => (
                    <CartItem 
                        item={item.product} 
                        quantity={item.quantity} 
                        onQuantityChange={(newQuantity) => updateItemQuantity(item.product.id, newQuantity)}
                    />
                )}
                keyExtractor={item => item.product.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={
                    <View style={styles.summaryContainer}>
                        <Text style={styles.sectionTitle}>Resoconto</Text>
                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotale</Text><Text style={styles.summaryValue}>€{totalPrice.toFixed(2)}</Text></View>
                        <View style={styles.summaryRow}><Text style={styles.summaryLabel}>IVA</Text><Text style={styles.summaryValue}>€{iva.toFixed(2)}</Text></View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}><Text style={styles.totalLabel}>Totale</Text><Text style={styles.totalValue}>€{finalTotal.toFixed(2)}</Text></View>
                    </View>
                }
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
            />
            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('OrderSummary', { cartItems, distributor, totalPrice })}>
                    <Text style={styles.actionButtonText}>Procedi al Pagamento</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white }, 
    headerNav: { padding: 20, alignItems: 'center',justifyContent: 'space-between',paddingTop: 40 }, 
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 22, color: COLORS.title }, 
    distributorCard: { backgroundColor: COLORS.lightGray, borderRadius: 12, padding: 15, marginBottom: 20 }, 
    distributorTitle: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: COLORS.text }, 
    distributorName: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title, marginVertical: 4 }, 
    distributorDescription: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: COLORS.text }, 
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
    actionButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: COLORS.white },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }, emptyText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.text }
});

