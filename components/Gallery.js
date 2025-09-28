// Gallery.js - Photo Grid Component (Snack-Safe Version)
import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { useSharedValue, runOnJS } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_SIZE = (screenWidth - 4) / 3;

// Generate mountain biking themed images
const generateMTBImages = () => {
  const images = [];
  for (let i = 0; i < 50; i++) {
    images.push({
      id: i.toString(),
      uri: `https://picsum.photos/400/400?random=${i}`,
    });
  }
  return images;
};

const IMAGES_DATA = generateMTBImages();

const Gallery = ({ onScroll, headerHeight = 190 }) => {
  const flatListRef = useRef(null);
  const previousScrollY = useSharedValue(0);
  const scrollDirection = useSharedValue(0); // -1 = up, 1 = down, 0 = no change

  // Function to update parent with new progress value
  const updateParentProgress = useCallback((progress) => {
    if (onScroll) {
      onScroll(progress);
    }
  }, [onScroll]);

  const handleScroll = useCallback((event) => {
    const currentY = event.nativeEvent.contentOffset.y;

    if (currentY >= 0 && currentY < 5000) {
      const prevY = previousScrollY.value;
      const deltaY = currentY - prevY;

      // Detect significant direction changes (ignore tiny movements)
      if (Math.abs(deltaY) > 2) {
        const newDirection = deltaY > 0 ? 1 : -1; // 1 = down, -1 = up

        // If direction changed, animate to appropriate state
        if (scrollDirection.value !== newDirection) {
          scrollDirection.value = newDirection;

          if (newDirection === 1) {
            // Scrolling down - immediately trigger parent animation
            runOnJS(updateParentProgress)(1);
          } else {
            // Scrolling up - immediately trigger parent animation
            runOnJS(updateParentProgress)(0);
          }
        }
      }

      previousScrollY.value = currentY;
    }
  }, [updateParentProgress]);

  const renderImage = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => console.log('Image pressed:', item.id)}
      >
        <Image source={{ uri: item.uri }} style={styles.gridImage} />
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = useCallback((item) => item.id, []);

  const headerComponent = useMemo(() => (
    <View style={{ height: headerHeight }} />
  ), [headerHeight]);

  const footerComponent = useMemo(() => (
    <View style={{ height: 100 }} />
  ), []);

  return (
    <FlatList
      ref={flatListRef}
      data={IMAGES_DATA}
      renderItem={renderImage}
      keyExtractor={keyExtractor}
      numColumns={3}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
      removeClippedSubviews={false}
      maxToRenderPerBatch={15}
      windowSize={10}
      initialNumToRender={15}
      contentContainerStyle={styles.gridContent}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  gridContent: {
    paddingHorizontal: 1,
  },
  row: {
    gap: 2,
  },
  gridImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: '#F2F2F7',
  },
});

export default Gallery;