import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../api/supabase';

const paymentStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#000' },
    content: { flex: 1, padding: 20 },
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: '#000', marginBottom: 20 },
    methodItem: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 15 },
    selectedMethod: { borderColor: '#007BFF', backgroundColor: '#F0F8FF' },
    methodLabel: { flex: 1, fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#555', marginLeft: 15 },
    selectedLabel: { fontFamily: 'SpaceGrotesk-Bold', color: '#007BFF' },
    footer: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#F0F0F0' },
    actionButton: { backgroundColor: '#2E3A59', padding: 15, borderRadius: 12, alignItems: 'center' },
    actionButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#FFFFFF' },
});

// Componente per una singola riga di metodo di pagamento
const PaymentMethodItem = ({ method, selected, onSelect }) => (
    <TouchableOpacity style={[paymentStyles.methodItem, selected && paymentStyles.selectedMethod]} onPress={onSelect}>
        <Ionicons name={method.icon} size={24} color={selected ? '#007BFF' : '#555'} />
        <Text style={[paymentStyles.methodLabel, selected && paymentStyles.selectedLabel]}>{method.label}</Text>
        {selected && <Ionicons name="checkmark-circle" size={24} color={'#007BFF'} />}
    </TouchableOpacity>
);

export default function PaymentScreen({ route, navigation }) {
    const { cartItems, distributor, finalTotal } = route.params;
    const { session } = useAuth();
    const { clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('card');

    const paymentMethods = [
        { id: 'card', label: 'Carta di Credito', icon: 'card-outline' },
        { id: 'paypal', label: 'PayPal', icon: 'logo-paypal' },
        { id: 'applepay', label: 'Apple Pay', icon: 'logo-apple' },
    ];

    const handlePayment = async () => {
        if (!session?.user) {
            Alert.alert("Errore", "Devi essere loggato per completare un ordine.");
            return;
        }
        setLoading(true);
        try {
            // Prepara i dati per la funzione RPC.
            const itemsForRPC = cartItems.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
            }));

            // Chiama la nuova funzione unificata 'place_order'
            const { data: newOrderId, error } = await supabase.rpc('place_order', {
                distributor_id_param: distributor.id,
                cart_items: itemsForRPC
            });

            if (error) {
                // Se la funzione RPC restituisce un errore (es. stock insufficiente), mostralo all'utente.
                throw new Error(error.message || "Impossibile creare l'ordine.");
            }

            // Se tutto va a buon fine, svuota il carrello e naviga.
            clearCart();
            navigation.navigate('OrderConfirmation', { orderId: newOrderId });

        } catch (error) {
            Alert.alert("Pagamento Fallito", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={paymentStyles.safeArea}>
            <View style={paymentStyles.headerNav}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={'#000'} /></TouchableOpacity>
                <Text style={paymentStyles.headerTitle}>Pagamento</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={paymentStyles.content}>
                <Text style={paymentStyles.sectionTitle}>Seleziona un metodo di pagamento</Text>
                {paymentMethods.map(method => (
                    <PaymentMethodItem 
                        key={method.id} 
                        method={method} 
                        selected={selectedMethod === method.id}
                        onSelect={() => setSelectedMethod(method.id)} 
                    />
                ))}
            </View>
            <View style={paymentStyles.footer}>
                <TouchableOpacity style={paymentStyles.actionButton} onPress={handlePayment} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : <Text style={paymentStyles.actionButtonText}>Paga €{finalTotal.toFixed(2)}</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
