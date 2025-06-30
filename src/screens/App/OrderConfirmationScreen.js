import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const COLORS = { background: '#F4F5F7', white: '#FFFFFF', text: '#555', title: '#000', primary: '#2E3A59', lightGray: '#F0F0F0' };

export default function OrderConfirmationScreen({ navigation }) {
    // In un'app reale, questo ID verrebbe da Supabase
    const orderId = `ORD-${Date.now()}`; 

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => navigation.popToTop()}><Ionicons name="arrow-back" size={24} color={COLORS.title} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Ordine Confermato</Text>
                <View style={{ width: 24 }} />
            </View>
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.successTitle}>Ordine effettuato con successo!</Text>
                    <Text style={styles.successMessage}>Il tuo ordine è stato effettuato con successo. Scansiona il codice al distributore di tuo interesse.</Text>
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={orderId}
                            size={220}
                            backgroundColor={COLORS.white}
                            color={COLORS.title}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.popToTop()}>
                    <Text style={styles.actionButtonText}>Fine</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',paddingTop: 40,  padding: 20 },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    content: { alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, padding: 30, width: '100%' },
    successTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 22, color: COLORS.title, textAlign: 'center' },
    successMessage: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: COLORS.text, textAlign: 'center', marginVertical: 15, lineHeight: 24 },
    qrContainer: { marginTop: 20, padding: 10, backgroundColor: COLORS.white, borderRadius: 8, },
    footer: { padding: 20, backgroundColor: COLORS.background },
    actionButton: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center' },
    actionButtonText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: COLORS.white },
});
