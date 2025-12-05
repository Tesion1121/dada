import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface Mahasiswa {
  id: string;
  nama: string;
  nim: string;
  jurusan?: string;
}

const PAGE_LIMIT = 10;

export default function MahasiswaScreen() {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [lastVisible, setLastVisible] = useState<FirebaseFirestoreTypes.DocumentData | null>(null);
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const collectionRef = firestore().collection('mahasiswa');
      const query = collectionRef.orderBy('nim').limit(PAGE_LIMIT);
      const documentSnapshots = await query.get();

      const users: Mahasiswa[] = [];
      documentSnapshots.forEach(doc => {
        users.push({ ...doc.data(), id: doc.id } as Mahasiswa);
      });

      if (documentSnapshots.docs.length > 0) {
        setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);
      }
      
      if (documentSnapshots.docs.length < PAGE_LIMIT) {
        setAllDataLoaded(true);
      } else {
        setAllDataLoaded(false);
      }

      setMahasiswa(users);
      
    } catch (e) {
      console.error("Error mengambil data awal:", e);
      Alert.alert("Error", "Gagal mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    if (loadingMore || allDataLoaded) return;

    try {
      setLoadingMore(true);
      const collectionRef = firestore().collection('mahasiswa');
      const query = collectionRef
        .orderBy('nim')
        .startAfter(lastVisible)
        .limit(PAGE_LIMIT);

      const documentSnapshots = await query.get();

      if (documentSnapshots.empty) {
        setAllDataLoaded(true);
        setLoadingMore(false);
        return;
      }

      const newUsers: Mahasiswa[] = [];
      documentSnapshots.forEach(doc => {
        newUsers.push({ ...doc.data(), id: doc.id } as Mahasiswa);
      });

      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      if (documentSnapshots.docs.length < PAGE_LIMIT) {
        setAllDataLoaded(true);
      }
      
      setMahasiswa(prevData => [...prevData, ...newUsers]);

    } catch (e) {
      console.error("Error mengambil data berikutnya:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const renderFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />;
    }
    
    if (allDataLoaded) {
      return <Text style={styles.footerText}>Semua data sudah dimuat</Text>;
    }
    
    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={fetchMoreData}>
        <Text style={styles.loadMoreText}>Muat Lebih Banyak</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Mengambil data...</Text>
      </View>
    );
  }

  if (mahasiswa.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Tidak ada data mahasiswa.</Text>
        <Text style={styles.loadingText}>Coba tekan tombol [ADMIN] di halaman Profile.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mahasiswa}
        keyExtractor={(item) => item.id}
        style={styles.list}
        ListHeaderComponent={
          <Text style={styles.title}>Data Mahasiswa</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.nama.substring(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemNama}>{item.nama}</Text>
              <Text style={styles.itemNim}>NIM: {item.nim}</Text>
              {item.jurusan && (
                <Text style={styles.itemNim}>Jurusan: {item.jurusan}</Text>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={renderFooter}
        onRefresh={fetchInitialData}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContent: {
    flex: 1,
  },
  itemNama: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  itemNim: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  loadMoreButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
});