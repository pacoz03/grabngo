import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert, View, Text } from 'react-native';
import { supabase } from '../../api/supabase';
// Componenti
import SearchBar from '../../components/commons/SearchBar';
import FilterPill from '../../components/app/FilterPill';
import RecipeCard from '../../components/app/RecipeCard';
import RecommendedRecipeCard from '../../components/app/RecommendedRecipeCard';

export default function RecipesScreen({ navigation }) {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
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
        let results = recipes;

        // Applica il filtro per categoria
        switch (activeFilter) {
            case 'Vegetariano':
                results = results.filter(r => r.is_vegetarian);
                break;
            case 'Veloce (<30m)':
                results = results.filter(r => r.time_minutes < 30);
                break;
            case 'Facile':
                results = results.filter(r => r.difficulty === 'Facile');
                break;
            default:
                break;
        }

        // Applica il filtro per la barra di ricerca
        if (searchQuery.trim()) {
            results = results.filter(r =>
                r.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return results;
    }, [activeFilter, recipes, searchQuery]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}><Text style={styles.headerTitle}>Ricette</Text></View>
                <SearchBar
                    placeholder="Cerca ricette per nome..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
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
                            ListEmptyComponent={<Text style={styles.noResults}>Nessuna ricetta trovata.</Text>}
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
    noResults: { fontFamily: 'SpaceGrotesk-Regular', paddingHorizontal: 20, color: '#666' }
});