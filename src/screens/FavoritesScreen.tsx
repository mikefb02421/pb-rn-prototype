import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import EmptyState from '../components/common/EmptyState';

const FavoritesScreen: React.FC = () => {
  const {favorites} = useSelector((state: RootState) => state.gallery);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>
      <View style={styles.content}>
        <EmptyState
          icon="favorite-border"
          title="No Favorites Yet"
          subtitle="Start adding images to your favorites collection"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default FavoritesScreen;