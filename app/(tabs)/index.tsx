import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { storage } from '../../utils/storage'; 
import auth from '@react-native-firebase/auth';
import { useMMKVString } from 'react-native-mmkv'; 

export default function DashboardScreen() {
  const [usernameFromMMKV] = useMMKVString('user.name', storage);
  const [emailFromMMKV] = useMMKVString('user.email', storage);

  const displayName = usernameFromMMKV || emailFromMMKV;

  if (!displayName) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halo,</Text>
      <Text style={styles.username}>{displayName}</Text>
      <Text style={styles.subtitle}>
        Selamat datang di aplikasi Anda.
      </Text>
      <Text style={styles.info}>
        Silakan pilih tab "Data Mahasiswa" untuk melihat tugas 3.
      </Text>
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
  title: {
    fontSize: 28,
    color: '#888',
  },
  username: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 30,
  }
});