import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const COLORS = { white: '#FFFFFF', text: '#555', title: '#000' };

const offerStyles = StyleSheet.create({
    container: {
        width: 130,
        marginRight: 15,
        alignItems: 'center',
    },
    card: {
        width: '100%',
        height: 120,
        borderRadius: 7,
        elevation: 3,
        overflow: 'hidden', 
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontFamily: 'SpaceGrotesk-Bold',
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
        textAlign: 'center',
    },
    code: {
        fontFamily: 'SpaceGrotesk-Regular',
        fontSize: 11,
        color: '#555',
        textAlign: 'center',
    },
});

export default function HomeOfferCard({ offer, onPress }) {
    return (
        <TouchableOpacity style={offerStyles.container} onPress={onPress}>
            <View style={offerStyles.card}>
                <Image source={{ uri: offer.image_url }} style={offerStyles.image} />
            </View>
            <Text style={offerStyles.title} numberOfLines={2}>{offer.title}</Text>
            <Text style={offerStyles.code}>Codice: {offer.code}</Text>
        </TouchableOpacity>
    );
}
