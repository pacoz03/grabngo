import React from 'react';
import {StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockOffers } from '../../data/mockData';
import OfferCard from '../../components/app/OfferCard';
import PersonalizedOfferCard from '../../components/app/PersonalizedOfferCard';


const COLORS = { background: '#F4F5F7', white: '#FFFFFF', title: '#000', text: '#333', border: '#DCDCDC' };

export default function OffersScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerNav}>
                <Text style={styles.headerTitle}>Offerte</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Le tue offerte</Text>
                    <FlatList
                        data={mockOffers.general}
                        renderItem={({ item }) => (
                            <View pointerEvents="none">
                                <OfferCard offer={item} />
                            </View>
                        )}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 20 }}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Offerte personalizzate</Text>
                    <View style={{ paddingHorizontal: 20 }}>
                        <View pointerEvents="none">
                            <PersonalizedOfferCard offer={mockOffers.personalized} />
                        </View>
                        {mockOffers.personalized.code && (
                            <View style={styles.offerCodeContainer}>
                                <Text style={styles.offerCodeText}>
                                    Codice: {mockOffers.personalized.code}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gamification</Text>
                    <View style={{ paddingHorizontal: 20 }}>
                        <View>
                            <PersonalizedOfferCard offer={mockOffers.gamification} />
                            <TouchableOpacity
                                style={StyleSheet.absoluteFill}
                                onPress={() => navigation.navigate('Profilo', { screen: 'Gamification' })}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.white },
    headerNav: { justifyContent: 'space-between', alignItems: 'center', paddingTop: 40, padding: 20 },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 22, color: COLORS.title },
    container: { paddingBottom: 20 },
    section: { marginTop: 20 },
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 22, color: COLORS.title, marginLeft: 20, marginBottom: 15 },
    offerCodeContainer: {
        marginTop: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    offerCodeText: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 18,
        color: COLORS.text,
    },
});