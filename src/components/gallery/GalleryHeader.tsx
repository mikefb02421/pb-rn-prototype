import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface GalleryHeaderProps {
  title: string;
  sortBy: string;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({title, sortBy}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sortBy}>Sorted by {sortBy}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  sortBy: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});

export default GalleryHeader;