import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

export default function ReviewItem({ review }) {
    const timeAgo = review.created_at ? formatDistanceToNow(parseISO(review.created_at), { addSuffix: true, locale: it }) : 'Adesso';
    
    // Gestisce il caso in cui il profilo non sia stato caricato
    const authorName = review.profiles?.full_name || 'Utente';
    const authorAvatar = review.profiles?.avatar_url || 'https://placehold.co/100x100/ccc/333?text=U';

    return (
        <View style={reviewStyles.container}>
            <Image source={{ uri: authorAvatar }} style={reviewStyles.avatar} />
            <View style={reviewStyles.content}>
                <View style={reviewStyles.header}>
                    <Text style={reviewStyles.author}>{authorName}</Text>
                    <Text style={reviewStyles.date}>{timeAgo}</Text>
                </View>
                <View style={reviewStyles.rating}>
                    {[...Array(5)].map((_, i) => <Ionicons key={i} name="star" size={14} color={i < review.rating ? '#FFC700' : '#E0E0E0'} />)}
                </View>
                <Text style={reviewStyles.text}>{review.comment}</Text>
            </View>
        </View>
    );
}
const reviewStyles = StyleSheet.create({
    container: { flexDirection: 'row', marginBottom: 20 },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
    content: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    author: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#000' },
    date: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 12, color: '#999' },
    rating: { flexDirection: 'row', marginVertical: 5 },
    text: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 14, color: '#333', lineHeight: 20 },
});