import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Notificaciones</Text>
        <Switch value={true} trackColor={{ false: "#767577", true: "#f3f706" }} thumbColor="#eb0b0b" />
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.settingText}>Modo Oscuro</Text>
        <Switch value={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  settingText: { fontSize: 16, fontWeight: '500' }
});