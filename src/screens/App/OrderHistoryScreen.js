import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';
import { useAuth } from '../../context/AuthContext';
import PastOrderListItem from '../../components/app/PastOrderListItem';

const COLORS = { background: '#F4F5F7', white: '#FFFFFF', title: '#000' };

export default function OrderHistoryScreen({ navigation }) {
    const { session } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            if (!session?.user) return;
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setOrders(data);
            } catch (error) {
                Alert.alert("Errore", "Impossibile caricare la cronologia ordini.");
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [session]);

    if (loading) {
        return <SafeAreaView style={styles.safeArea}><ActivityIndicator style={{flex: 1}} /></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={COLORS.title} /></TouchableOpacity>
                <Text style={styles.headerTitle}>Cronologia Ordini</Text>
                <View style={{ width: 24 }} />
            </View>
            <FlatList
                data={orders}
                renderItem={({ item }) => <PastOrderListItem order={item} />}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<Text style={styles.sectionTitle}>Ordini Passati</Text>}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                ListEmptyComponent={<Text style={{textAlign: 'center', fontFamily: 'SpaceGrotesk-Regular'}}>Nessun ordine trovato.</Text>}
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white },
    headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 ,paddingTop:40},
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title },
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: COLORS.title, marginTop: 10, marginBottom: 15 },
});