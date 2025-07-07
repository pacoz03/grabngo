import { Image } from 'react-native';
import IngredientListItem from '../../components/app/IngredientListItem';
import RecipeStep from '../../components/app/RecipeStep';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';


const detailStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
    headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop:40 },
    headerTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: '#000', flex: 1, textAlign: 'center' },
    headerImage: { width: '100%', height: 220 },
    content: { padding: 20 },
    title: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 24, color: '#000', marginBottom: 8 },
    description: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#555', lineHeight: 24, marginBottom: 20 },
    sectionTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: '#000', marginTop: 20, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
});

export default function RecipeDetailScreen({ route, navigation }) {
    const { recipeId } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecipeDetails() {
            try {
                setLoading(true);
                const { data: recipeData, error: recipeError } = await supabase
                    .from('recipes')
                    .select('*')
                    .eq('id', recipeId)
                    .single();
                if (recipeError) throw recipeError;
                setRecipe(recipeData);

                const { data: ingredientsData, error: ingredientsError } = await supabase
                    .from('recipe_products')
                    .select('quantity_needed, products(*)')
                    .eq('recipe_id', recipeId);
                if (ingredientsError) throw ingredientsError;
                setIngredients(ingredientsData);

            } catch (error) {
                Alert.alert("Errore", "Impossibile caricare i dettagli della ricetta.");
            } finally {
                setLoading(false);
            }
        }
        fetchRecipeDetails();
    }, [recipeId]);

    if (loading) {
        return <SafeAreaView style={detailStyles.safeArea}><ActivityIndicator style={{flex: 1}} /></SafeAreaView>
    }
    if (!recipe) {
        return <SafeAreaView style={detailStyles.safeArea}><Text>Ricetta non trovata.</Text></SafeAreaView>
    }

    return (
        <SafeAreaView style={detailStyles.safeArea}>
            <View style={detailStyles.headerNav}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={'#000'} /></TouchableOpacity>
                <Text style={detailStyles.headerTitle} numberOfLines={1}>{recipe.title}</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView>
                <Image source={{ uri: recipe.image_url }} style={detailStyles.headerImage} />
                <View style={detailStyles.content}>
                    <Text style={detailStyles.title}>{recipe.title}</Text>
                    <Text style={detailStyles.description}>{recipe.description}</Text>
                    
                    <Text style={detailStyles.sectionTitle}>Ingredienti</Text>
                    {ingredients.map(ing => <IngredientListItem key={ing.products.id} ingredient={ing} />)}

                    <Text style={detailStyles.sectionTitle}>Procedimento</Text>
                    {recipe.steps?.map((step, index) => <RecipeStep key={index} step={step} index={index} />)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}