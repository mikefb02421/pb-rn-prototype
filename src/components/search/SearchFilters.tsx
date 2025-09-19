import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const SearchFilters: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Filters (Coming Soon)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  text: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default SearchFilters;