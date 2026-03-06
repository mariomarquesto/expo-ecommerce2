import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Botón Volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>¡Hola de nuevo!</Text>
            <Text style={styles.subtitle}>Ingresá a tu cuenta para continuar comprando.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Email" 
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="Contraseña" 
                value={password}
                onChangeText={setPassword}
                secureTextEntry 
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={() => router.replace('/drawer' as any)}>
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink}>
              <Text style={styles.registerText}>¿No tienes cuenta? <Text style={styles.boldText}>Regístrate</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 20, marginTop: 10 },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  headerSection: { marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#000' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 10 },
  form: { gap: 20 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5', 
    borderRadius: 12, 
    paddingHorizontal: 15 
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 55, fontSize: 16 },
  loginButton: { 
    backgroundColor: '#000', 
    height: 55, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  registerLink: { alignItems: 'center', marginTop: 10 },
  registerText: { color: '#666' },
  boldText: { color: '#eb0b0b', fontWeight: 'bold' }
});