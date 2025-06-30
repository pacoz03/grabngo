import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Text, View, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../api/supabase';
// Componenti
import SearchBar from '../../components/commons/SearchBar';
import FilterButtons from '../../components/app/FilterButtons';
import DistributorListItem from '../../components/app/DistributorListItem';

const searchStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F5F7' },
  container: { flex: 1 },
  listContent: { paddingBottom: 20 },
  emptyContainer: { flex: 1, marginTop: 50, alignItems: 'center' },
  emptyText: { fontFamily: 'SpaceGrotesk-Regular', fontSize: 16, color: '#666' }
});

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [distributors, setDistributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const searchDistributors = useCallback(async (query) => {
    setIsSearching(true);

    

    try {
      let supabaseQuery = supabase.from('distributors').select('id, name, description');
      
      if (query) {
        supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }

      const { data, error } = await supabaseQuery;
      
      if (error) throw error;

      if (data) {
        setDistributors(data);
      }
    } catch (error) {
      Alert.alert("Errore", "Impossibile eseguire la ricerca.");
    } finally {
      setIsSearching(false);
      setLoading(false); // Imposta loading a false dopo la prima ricerca
    }
  }, []);
  
  // Carica tutti i distributori la prima volta che la schermata viene aperta
  useEffect(() => {
    searchDistributors('');
  }, [searchDistributors]);
  
  // Effetto per gestire la ricerca con "debouncing"
  useEffect(() => {
    // Imposta un timer per eseguire la ricerca 300ms dopo che l'utente ha smesso di digitare
    const handler = setTimeout(() => {
      // Non eseguire la ricerca iniziale due volte
      if (!loading) { 
        searchDistributors(searchQuery);
      }
    }, 200);

    // Pulisce il timer se l'utente digita di nuovo
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, loading, searchDistributors]);

  // Se i dati iniziali stanno ancora caricando, mostra un loader
  if (loading) {
      return (
          <SafeAreaView style={searchStyles.safeArea}>
              <SearchBar placeholder="Cerca distributori..." editable={false} />
              <View style={searchStyles.emptyContainer}><ActivityIndicator size="large" color="#0000ff" /></View>
          </SafeAreaView>
      )
  }

  return (
    <SafeAreaView style={searchStyles.safeArea}>
      <FlatList
        data={distributors}
        renderItem={({ item }) => <DistributorListItem distributor={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <>
            <SearchBar placeholder="Cerca distributori..." autoFocus={true} value={searchQuery} onChangeText={setSearchQuery} />
            <FilterButtons />
            {isSearching && <ActivityIndicator style={{ marginVertical: 10 }} color="#0000ff" />}
          </>
        }
        ListEmptyComponent={
            <View style={searchStyles.emptyContainer}>
                {!isSearching && <Text style={searchStyles.emptyText}>Nessun distributore trovato.</Text>}
            </View>
        }
        style={searchStyles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={searchStyles.listContent}
      />
    </SafeAreaView>
  );
}