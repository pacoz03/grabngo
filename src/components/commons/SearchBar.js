import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({
  editable = true,
  autoFocus = false,
  value,
  onChangeText,
  placeholder = "Cerca un distributore"
}) {
  return (
    <View style={searchBarStyles.container}>
      <View style={searchBarStyles.searchSection}>
        <Ionicons name="search" size={20} color="#8e8e93" style={searchBarStyles.icon} />
        <TextInput
          style={searchBarStyles.input}
          placeholder={placeholder}
          placeholderTextColor="#8e8e93"
          editable={editable}
          autoFocus={autoFocus}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const searchBarStyles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#F4F5F7' },
  searchSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 15, height: 48, borderWidth: 1, borderColor: '#E8E8E8' },
  icon: { marginRight: 10, },
  input: { flex: 1, fontSize: 16, color: '#000', fontFamily: 'SpaceGrotesk-Regular' },
});