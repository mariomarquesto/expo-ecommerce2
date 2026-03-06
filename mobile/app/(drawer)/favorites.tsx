import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="heart-dislike-outline" size={70} color="#eb0b0b" />
      <Text style={styles.text}>Aún no tienes favoritos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18, color: '#333', marginTop: 10 }
});