import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { storage } from '../../utils/storage';
import auth from '@react-native-firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordHidden, setPasswordHidden] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      setErrorText('Email dan password tidak boleh kosong.');
      return;
    }
    setLoading(true);
    setErrorText('');

    auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        storage.set('user.uid', user.uid);
        if (user.email) {
          storage.set('user.email', user.email);
        }
        if (user.displayName) {
          storage.set('user.name', user.displayName);
        }

        router.replace('/(tabs)');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
          setErrorText('Email atau password salah.');
        } else {
          setErrorText('Terjadi kesalahan. Coba lagi.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selamat Datang!</Text>
      <Text style={styles.subtitle}>Login untuk melanjutkan</Text>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={isPasswordHidden}
        />
        <Pressable onPress={() => setPasswordHidden(!isPasswordHidden)}>
          <Feather 
            name={isPasswordHidden ? 'eye-off' : 'eye'} 
            size={24} 
            color="#888" 
          />
        </Pressable>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin} 
        disabled={isLoading} 
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Belum punya akun? </Text>
        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text style={styles.registerLink}>Daftar Sekarang</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F7F7F7',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#F7F7F7',
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerText: {
    fontSize: 14,
    color: '#888',
  },
  registerLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});