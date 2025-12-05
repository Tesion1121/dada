import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { storage } from '../../utils/storage';
import auth from '@react-native-firebase/auth';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    setEmail(storage.getString('user.email') || '');
    setUsername(storage.getString('user.name') || 'Pengguna');
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            console.log("Melakukan logout...");
            auth()
              .signOut()
              .then(() => {
                storage.clearAll();
                console.log("User logged out & MMKV cleared!");
                router.replace('/(auth)/login');
              })
              .catch(error => {
                console.error("Logout error:", error);
                storage.clearAll();
                router.replace('/(auth)/login');
              });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <FontAwesome name="user-circle" size={80} color="#007AFF" />
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.email}>{email}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 16,
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FF3B30', 
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
});