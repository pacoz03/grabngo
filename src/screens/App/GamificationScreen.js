import React, { useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert,} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../api/supabase';

const GamificationScreen = () => {
    const { session, profile, refreshProfile } = useAuth();
    const navigation = useNavigation();

    const [userPoints, setUserPoints] = useState(profile?.points || 0);
    const handleRedeem = async (reward) => {
        if (userPoints >= reward.points && profile?.id) {
            const newPoints = userPoints - reward.points;
            setUserPoints(newPoints);

            const { error } = await supabase
                .from('profiles')
                .update({ points: newPoints })
                .eq('id', profile.id);

            if (error) {
                Alert.alert('Errore', 'Impossibile aggiornare i punti su Supabase.');
            } else {
                await refreshProfile();
                Alert.alert('Premio riscattato!', `Hai riscattato ${reward.title} 🎉`);
            }
        }
    };

    const miniGames = [
        {
            title: 'Quiz del Giorno',
            subtitle1: 'Rispondi a 3 domande',
            subtitle2: 'sulla Dieta Mediterranea',
            points: '+5 punti',
            image: 'https://plus.unsplash.com/premium_photo-1674428452435-a09be83ddb38?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'Ruota della Fortuna',
            subtitle1: 'Gira la Ruota',
            subtitle2: '1 volta al giorno',
            points: '+5 punti',
            image: 'https://plus.unsplash.com/premium_photo-1718191345799-30f50e04a57a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'Sfida del Giorno',
            subtitle1: 'Compra un prodotto da',
            subtitle2: 'una ricetta proposta',
            points: '+10 punti',
            image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxpYnJvJTIwcmljZXR0ZXxlbnwwfHwwfHx8MA%3D%3D',
        },
    ];

    const rewards = [
        {
            title: 'Caffè Gratis',
            points: 100,
            image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: '10% di Sconto',
            points: 200,
            image: 'https://plus.unsplash.com/premium_photo-1683887064374-dc6dd77ece50?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: 'Snack Gratis',
            points: 300,
            image: 'https://images.unsplash.com/photo-1590400926865-1c70a2586bb5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gamification</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {session && profile && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressTextSection}>
                            <Text style={styles.progressTitle}>I Miei Progressi</Text>
                            <Text style={styles.progressPoints}>
                                Totale Punti:{' '}
                                <Text style={{ fontWeight: 'bold' }}>{userPoints}</Text>
                            </Text>
                            <Text style={styles.progressSubtitle}>
                                Punti guadagnati da sfide e minigiochi
                            </Text>
                            <TouchableOpacity style={styles.progressButton}>
                                <Text style={styles.progressButtonText}>Visualizza Premi</Text>
                            </TouchableOpacity>
                        </View>
                        <Image
                            source={{
                                uri: 'https://plus.unsplash.com/premium_photo-1682310140123-d479f37e2c88?q=80&w=1212&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                            }}
                            style={styles.progressImage}
                        />
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Challenges & Mini‑Games</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false} alwaysBounceHorizontal={false} contentContainerStyle={{ paddingRight: 20 }}>
                    {miniGames.map((item, index) => (
                        <View
                            key={index}
                            style={[
                                styles.miniGameCard,
                                {
                                    marginLeft: index === 0 ? 20 : 12,
                                },
                            ]}
                        >
                            <Image source={{ uri: item.image }} style={styles.miniGameImage}/>
                            <Text style={styles.miniGameTitle}>{item.title}</Text>
                            <View style={styles.subtitleContainer}>
                                <Text style={styles.subtitleLine}>{item.subtitle1}</Text>
                                <Text style={styles.subtitleLine}>{item.subtitle2}</Text>
                            </View>
                            <Text style={styles.miniGamePoints}>{item.points}</Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Premi Disponibili</Text>
                    {rewards.map((reward, index) => {
                        const canRedeem = userPoints >= reward.points;
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.rewardRow,
                                    {
                                        opacity: canRedeem ? 1 : 0.4,
                                        backgroundColor: canRedeem
                                            ? '#E8F8F1'
                                            : '#f0f0f0',
                                    },
                                ]}
                            >
                                <Image
                                    source={{ uri: reward.image }}
                                    style={styles.rewardIcon}
                                />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.rewardText}>{reward.title}</Text>
                                    <Text style={styles.rewardPoints}>
                                        {reward.points} punti
                                    </Text>
                                </View>
                                {canRedeem && (
                                    <TouchableOpacity
                                        onPress={() => handleRedeem(reward)}
                                        style={styles.redeemButton}
                                    >
                                        <Text style={styles.redeemButtonText}>
                                            Riscatta
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F5F7' },
    container: { flex: 1 },
    header: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'SpaceGrotesk-Bold',
        color: '#000',
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F7F9FC',
        padding: 16,
        marginTop: 20,
        borderRadius: 16,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 360,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    progressTextSection: {
        flex: 1,
        marginRight: 10,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 6,
        color: '#000',
    },
    progressPoints: {
        fontSize: 14,
        color: '#000',
    },
    progressSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 10,
    },
    progressButton: {
        backgroundColor: '#E5EAFD',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    progressButtonText: {
        color: '#2F80ED',
        fontSize: 13,
        fontWeight: '600',
    },
    progressImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'SpaceGrotesk-Bold',
        color: '#000',
        marginBottom: 10,
    },
    miniGameCard: {
        width: 160,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    miniGameImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    miniGameTitle: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 2,
    },
    subtitleContainer: {
        alignItems: 'center',
        marginBottom: 4,
    },
    subtitleLine: {
        fontSize: 12,
        textAlign: 'center',
        color: '#555',
    },
    miniGamePoints: {
        fontSize: 12,
        color: '#2F80ED',
        fontWeight: '600',
    },
    rewardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 12,
    },
    rewardIcon: {
        width: 55,
        height: 55,
        borderRadius: 8,
        marginRight: 12,
    },
    rewardText: {
        fontSize: 14,
        fontWeight: '600',
    },
    rewardPoints: {
        fontSize: 12,
        color: '#888',
    },
    redeemButton: {
        backgroundColor: '#2F80ED',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    redeemButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default GamificationScreen;
