import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import ProfileListItem from '../../components/app/ProfileListItem';

const PROFILE_COLORS = { background: '#F4F5F7', white: '#FFFFFF', text: '#555', title: '#000' };

export default function ProfileScreen({ navigation }) {
     const { session, profile, signOut } = useAuth();

    const sections = {
        personal: [
            { icon: 'leaf-outline', label: 'Tipologia di Dieta', value: profile?.diet_preference || 'Non specificata' },
        ],
        account: [
            { icon: 'time-outline', label: 'Cronologia Ordini', screen: 'OrderHistory' },
            { icon: 'ribbon-outline', label: 'Punti e Premi di Gamification' },
            { icon: 'card-outline', label: 'Metodi di Pagamento' },
        ],
        support: [ { icon: 'help-circle-outline', label: 'FAQ' } ],
        auth: [ { icon: 'log-out-outline', label: 'Esci', action: signOut } ]
    };

    if (!profile) {
        return <SafeAreaView style={styles.safeArea}><ActivityIndicator style={{flex: 1}} /></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}><Text style={styles.headerTitle}>Account</Text></View>
                <View style={styles.profileInfoContainer}>
                    <Image source={{ uri: profile.avatar_url || 'https://placehold.co/100x100/ccc/333?text=U' }} style={styles.avatar} />
                    <Text style={styles.name}>{profile.full_name || 'Utente'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informazioni Personali</Text>
                    <View style={styles.card}>
                        <ProfileListItem type="personal" item={{ icon: 'mail-outline', label: 'Email', value: session?.user?.email }} />
                        <View style={styles.divider} />
                        <ProfileListItem type="personal" item={sections.personal[0]} />
                    </View>
                </View>

                 <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gestione Account</Text>
                    <View style={styles.card}>
                       {sections.account.map((item, index) => (
                           <React.Fragment key={item.label}>
                               <ProfileListItem type="navigation" item={item} onPress={() => item.screen && navigation.navigate(item.screen)} />
                               {index < sections.account.length - 1 && <View style={styles.divider} />}
                           </React.Fragment>
                       ))}
                    </View>
                </View>
                
                 <View style={styles.section}><Text style={styles.sectionTitle}>Supporto</Text><View style={styles.card}><ProfileListItem type="navigation" item={sections.support[0]} /></View></View>
                 
                 <View style={styles.section}>
                    <View style={styles.card}>
                       <ProfileListItem type="navigation" item={sections.auth[0]} onPress={sections.auth[0].action} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: PROFILE_COLORS.background }, container: { flex: 1 },
    header: { justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop:40 },
    headerTitle: { fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', color: PROFILE_COLORS.title },
    profileInfoContainer: { alignItems: 'center', marginVertical: 10, marginBottom: 30 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    name: { fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', marginTop: 15, color: PROFILE_COLORS.title },
    section: { paddingHorizontal: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 18, fontFamily: 'SpaceGrotesk-Bold', color: PROFILE_COLORS.title, marginBottom: 10 },
    card: { backgroundColor: PROFILE_COLORS.white, borderRadius: 12, paddingHorizontal: 15 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 45 }
});