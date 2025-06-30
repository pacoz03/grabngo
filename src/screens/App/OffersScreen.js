import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockOffers } from '../../data/mockData';
import OfferCard from '../../components/app/OfferCard';
import PersonalizedOfferCard from '../../components/app/PersonalizedOfferCard';

const COLORS = { background: '#F4F5F7', white: '#FFFFFF', title: '#000' };

export default function OffersScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerNav}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.title} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Offerte</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Le tue offerte</Text>
                    <FlatList
                        data={mockOffers.general}
                        renderItem={({ item }) => <OfferCard offer={item} />}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20 }}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Offerte personalizzate</Text>
                    <View style={{ paddingHorizontal: 20 }}>
                       <PersonalizedOfferCard offer={mockOffers.personalized} />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gamification</Text>
                     <View style={{ paddingHorizontal: 20 }}>
                        <PersonalizedOfferCard offer={mockOffers.gamification} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white },
    headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',paddingTop:40, padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.background },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: COLORS.title },
    container: { paddingBottom: 20 },
    section: { marginTop: 20 },
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 22, color: COLORS.title, marginLeft: 20, marginBottom: 15 },
});