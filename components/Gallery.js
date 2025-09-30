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

const Gallery = ({ onScroll, headerHeight = 168 }) => {
  const flatListRef = useRef(null);
  const previousScrollY = useSharedValue(0);
  const scrollDirection = useSharedValue(0); // -1 = up, 1 = down, 0 = no change

  // Function to update parent with both position and direction
  const updateParent = useCallback((position, direction) => {
    if (onScroll) {
      onScroll({ position, direction });
    }
  }, [onScroll]);

  const handleScroll = useCallback((event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const contentSize = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (currentY >= 0 && currentY < 5000) {
      const prevY = previousScrollY.value;
      const deltaY = currentY - prevY;

      // Calculate position-based progress (for hero)
      const maxScroll = 300;
      const positionProgress = Math.min(1, Math.max(0, currentY / maxScroll));

      // Check if we're near the bottom to prevent bounce direction changes
      const isNearBottom = currentY + layoutHeight >= contentSize - 50; // 50px buffer

      // Detect direction changes (for bottom nav)
      let directionValue = scrollDirection.value;
      if (Math.abs(deltaY) > 2 && !isNearBottom) {
        const newDirection = deltaY > 0 ? 1 : -1; // 1 = down, -1 = up
        if (scrollDirection.value !== newDirection) {
          scrollDirection.value = newDirection;
          directionValue = newDirection;
        }
      }

      // Send both values to parent
      runOnJS(updateParent)(positionProgress, directionValue);

      previousScrollY.value = currentY;
    }
  }, [updateParent, previousScrollY, scrollDirection]);

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