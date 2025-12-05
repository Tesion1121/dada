import React, { useState, useEffect } from 'react';
import { Stack, router, Slot } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { storage } from '../utils/storage'; 
import auth from '@react-native-firebase/auth';

export default function RootLayout() {
  const [isReady, setReady] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const uid = storage.getString('user.uid');
        
        const user = auth().currentUser;

        if (uid && user) {
          console.log('Auth check: User is logged in (UID:', uid, ')');
          setAuthenticated(true);
        } else {
          console.log('Auth check: User is not logged in.');
          setAuthenticated(false);
          if (uid && !user) {
            storage.clearAll();
          }
        }
      } catch (e) {
        console.error("Failed to check auth status:", e);
        setAuthenticated(false);
      }
      setReady(true);
    };

    checkAuth();

    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
        storage.clearAll(); 
      }
    });

    return () => unsubscribe(); 
  }, []);

  useEffect(() => {
    if (!isReady) {
      return; 
    }

    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isReady, isAuthenticated]); 

  if (!isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Slot />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  }
});