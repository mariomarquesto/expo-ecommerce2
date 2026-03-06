import React from 'react';
import { View, Text, StyleSheet,  TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={60} color="#fff" />
        </View>
        <Text style={styles.userName}>Usuario Invitado</Text>
        <Text style={styles.userEmail}>usuario@ejemplo.com</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Mis Direcciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="card-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Métodos de Pago</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#f3f706', padding: 40, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#eb0b0b', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  userEmail: { fontSize: 14, color: '#666' },
  menu: { marginTop: 20, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  menuText: { marginLeft: 15, fontSize: 16, fontWeight: '500' }
});