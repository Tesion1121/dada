import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { storage } from '../../utils/storage';
import auth from '@react-native-firebase/auth';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isPasswordHidden, setPasswordHidden] = useState(true);
  const [isConfirmHidden, setConfirmHidden] = useState(true);
  
  const [isLoading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleRegister = () => {
    if (username === '' || email === '' || password === '' || confirmPassword === '') {
      setErrorText('Semua field harus diisi.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorText('Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setErrorText('Password minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    setErrorText('');

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        return user.updateProfile({
          displayName: username
        }).then(() => {
          storage.set('user.uid', user.uid);
          if (user.email) {
            storage.set('user.email', user.email);
          }
          storage.set('user.name', username);
          
          console.log('Register sukses, data disimpan ke MMKV.');
          router.replace('/(tabs)');
        });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          setErrorText('Email ini sudah terdaftar.');
        } else if (error.code === 'auth/invalid-email') {
          setErrorText('Format email tidak valid.');
        } else {
          setErrorText('Terjadi kesalahan. Coba lagi.');
        }
        console.error('Register Error:', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Buat Akun Baru</Text>
      <Text style={styles.subtitle}>Isi data diri Anda</Text>

      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
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
          placeholder="Password (min. 6 karakter)"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={isPasswordHidden}
        />
        <Pressable onPress={() => setPasswordHidden(!isPasswordHidden)}>
          <Feather name={isPasswordHidden ? 'eye-off' : 'eye'} size={24} color="#888" />
        </Pressable>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Konfirmasi Password"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={isConfirmHidden}
        />
        <Pressable onPress={() => setConfirmHidden(!isConfirmHidden)}>
          <Feather name={isConfirmHidden ? 'eye-off' : 'eye'} size={24} color="#888" />
        </Pressable>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister} 
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Sudah punya akun? </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable>
            <Text style={styles.loginLink}>Login</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    marginBottom: 15,
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
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    fontSize: 14,
    color: '#888',
  },
  loginLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  }
});