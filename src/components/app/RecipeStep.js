import { StyleSheet, View, Text } from 'react-native';

const stepStyles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 15 },
    number: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#007BFF', marginRight: 15, lineHeight: 24 },
    text: { flex: 1, fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#333', lineHeight: 24 }
});

export default function RecipeStep({ step, index }) {
    return (
        <View style={stepStyles.container}>
            <Text style={stepStyles.number}>{index + 1}</Text>
            <Text style={stepStyles.text}>{step}</Text>
        </View>
    );
}