import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const orderItemStyles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderColor: '#F0F0F0' },
    date: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#000' },
    count: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: '#555', marginTop: 4 },
    total: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#000' }
});

export default function PastOrderListItem({ order }) {
    const navigation = useNavigation();
    
    if (!order || typeof order.total_price === 'undefined') {
        return null; // Evita crash se i dati non sono validi
    }

    const formattedDate = order.created_at
        ? format(new Date(order.created_at), 'd MMMM yyyy', { locale: it })
        : 'Data non disponibile';

    return (
        <TouchableOpacity style={orderItemStyles.container} onPress={() => navigation.navigate('PastOrderDetail', { order })}>
            <View>
                <Text style={orderItemStyles.date}>{formattedDate}</Text>
                {/* Il conteggio dei prodotti richiederebbe una query aggiuntiva, per ora mostriamo un testo generico */}
                <Text style={orderItemStyles.count}>Visualizza dettagli</Text>
            </View>
            <Text style={orderItemStyles.total}>€{parseFloat(order.total_price).toFixed(2)}</Text>
        </TouchableOpacity>
    );
}