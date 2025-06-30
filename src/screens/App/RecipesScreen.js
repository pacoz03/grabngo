import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../api/supabase';
// Componenti
import SearchBar from '../../components/commons/SearchBar';
import FilterPill from '../../components/app/FilterPill';
import RecipeCard from '../../components/app/RecipeCard';
import RecommendedRecipeCard from '../../components/app/RecommendedRecipeCard';

const RECIPES_COLORS = { background: '#F4F5F7', title: '#000' };

const filters = ['Tutte', 'Vegetariano', 'Veloce (<30m)', 'Facile'];

export default function RecipesScreen({ navigation }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Tutte');

    useEffect(() => {
        async function fetchRecipes() {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('recipes').select('*');
                if (error) throw error;
                if (data) setRecipes(data);
            } catch (error) {
                Alert.alert("Errore", "Impossibile caricare le ricette.");
            } finally {
                setLoading(false);
            }
        }
        fetchRecipes();
    }, []);
    
    const filteredRecipes = useMemo(() => {
        switch (activeFilter) {
            case 'Vegetariano':
                return recipes.filter(recipe => recipe.is_vegetarian);
            case 'Veloce (<30m)':
                return recipes.filter(recipe => recipe.time_minutes < 30);
            case 'Facile':
                return recipes.filter(recipe => recipe.difficulty === 'Facile');
            case 'Tutte':
            default:
                return recipes;
        }
    }, [activeFilter, recipes]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}><Text style={styles.headerTitle}>Ricette</Text></View>
                <SearchBar placeholder="Cerca ricette" />
                <View>
                    <FlatList 
                        data={filters}
                        renderItem={({ item }) => (
                            <FilterPill
                                label={item}
                                active={item === activeFilter}
                                onPress={() => setActiveFilter(item)}
                            />
                        )}
                        keyExtractor={item => item}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterList}
                    />
                </View>
                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ricette</Text>
                    {loading ? (
                        <ActivityIndicator style={{ height: 150 }} color="#0000ff" />
                    ) : (
                        filteredRecipes.length > 0 ? (
                            <FlatList data={filteredRecipes} renderItem={({ item }) => <RecipeCard recipe={item} />} keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeList} />
                        ) : (
                            <Text style={styles.noResults}>Nessuna ricetta trovata per questo filtro.</Text>
                        )
                    )}
                </View>
                
                <View style={styles.section}><Text style={styles.sectionTitle}>Raccomandati per te</Text><View style={styles.recommendedContainer}><RecommendedRecipeCard /></View></View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F5F7' }, header: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 }, headerTitle: { fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', color: '#000' }, filterList: { paddingHorizontal: 20, paddingVertical: 10 }, section: { marginTop: 20 }, sectionTitle: { fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', color: '#000', marginLeft: 20, marginBottom: 15 }, recipeList: { paddingLeft: 20 }, recommendedContainer: { paddingHorizontal: 20 }, noResults: { fontFamily: 'SpaceGrotesk-Regular', marginLeft: 20, color: '#666' }
});
