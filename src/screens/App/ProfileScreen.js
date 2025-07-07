import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../api/supabase';
// Componenti
import SearchBar from '../../components/commons/SearchBar';
import FilterPill from '../../components/app/FilterPill';
import RecipeCard from '../../components/app/RecipeCard';
import RecommendedRecipeCard from '../../components/app/RecommendedRecipeCard';

export default function RecipesScreen({ navigation }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('Tutte');
    const filters = ['Tutte', 'Vegetariano', 'Veloce (<30m)', 'Facile'];

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
            case 'Vegetariano': return recipes.filter(r => r.is_vegetarian);
            case 'Veloce (<30m)': return recipes.filter(r => r.time_minutes < 30);
            case 'Facile': return recipes.filter(r => r.difficulty === 'Facile');
            default: return recipes;
        }
    }, [activeFilter, recipes]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}><Text style={styles.headerTitle}>Ricette</Text></View>
                <SearchBar placeholder="Cerca ricette" />
                <FlatList 
                    data={filters}
                    renderItem={({ item }) => <FilterPill label={item} active={item === activeFilter} onPress={() => setActiveFilter(item)} />}
                    keyExtractor={item => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterList}
                />
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ricette</Text>
                    {loading ? <ActivityIndicator style={{ height: 150 }} /> : (
                        <FlatList 
                            data={filteredRecipes} 
                            renderItem={({ item }) => (
                                <RecipeCard 
                                    recipe={item} 
                                    onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
                                />
                            )} 
                            keyExtractor={item => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.recipeList}
                        />
                    )}
                </View>
                <View style={styles.section}><Text style={styles.sectionTitle}>Raccomandati per te</Text><View style={styles.recommendedContainer}><RecommendedRecipeCard /></View></View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F4F5F7' },
    header: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
    headerTitle: { fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', color: '#000' },
    filterList: { paddingHorizontal: 20, paddingVertical: 10 },
    section: { marginTop: 20 },
    sectionTitle: { fontSize: 22, fontFamily: 'SpaceGrotesk-Bold', color: '#000', marginLeft: 20, marginBottom: 15 },
    recipeList: { paddingLeft: 20 },
    recommendedContainer: { paddingHorizontal: 20 },
});