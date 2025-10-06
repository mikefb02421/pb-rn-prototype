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

// Calculate where gallery should start (below title/avatars)
const GALLERY_START_TOP = screenWidth;

// Array of Moab images - explicit requires for Expo Snack compatibility
const MOAB_IMAGES = [
  require('../assets/dummy-moab-1.jpg'),
  require('../assets/dummy-moab-2.jpg'),
  require('../assets/dummy-moab-3.jpg'),
  require('../assets/dummy-moab-4.jpg'),
  require('../assets/dummy-moab-5.jpg'),
  require('../assets/dummy-moab-6.jpg'),
  require('../assets/dummy-moab-7.jpg'),
  require('../assets/dummy-moab-8.jpg'),
  require('../assets/dummy-moab-9.jpg'),
  require('../assets/dummy-moab-10.jpg'),
  require('../assets/dummy-moab-11.jpg'),
  require('../assets/dummy-moab-12.jpg'),
  require('../assets/dummy-moab-13.jpg'),
  require('../assets/dummy-moab-14.jpg'),
  require('../assets/dummy-moab-15.jpg'),
  require('../assets/dummy-moab-16.jpg'),
  require('../assets/dummy-moab-17.jpg'),
  require('../assets/dummy-moab-18.jpg'),
  require('../assets/dummy-moab-19.jpg'),
  require('../assets/dummy-moab-20.jpg'),
  require('../assets/dummy-moab-21.jpg'),
  require('../assets/dummy-moab-22.jpg'),
  require('../assets/dummy-moab-23.jpg'),
  require('../assets/dummy-moab-24.jpg'),
  require('../assets/dummy-moab-25.jpg'),
  require('../assets/dummy-moab-26.jpg'),
  require('../assets/dummy-moab-27.jpg'),
  require('../assets/dummy-moab-28.jpg'),
];

// Generate Moab adventure images
const generateMoabImages = () => {
  const images = [];
  // Use your 28 Moab images, then repeat them to fill the gallery
  for (let i = 0; i < 100; i++) {
    const imageIndex = i % MOAB_IMAGES.length; // Cycle through the images array
    images.push({
      id: i.toString(),
      uri: MOAB_IMAGES[imageIndex],
    });
  }
  return images;
};

const IMAGES_DATA = generateMoabImages();

const Gallery = ({ onScroll, headerHeight = 168 }) => {
  const flatListRef = useRef(null);
  const previousScrollY = useSharedValue(0);
  const scrollDirection = useSharedValue(0); // -1 = up, 1 = down, 0 = no change

  // Function to update parent with position, direction, and overscroll
  const updateParent = useCallback((position, direction, overscroll) => {
    if (onScroll) {
      onScroll({ position, direction, overscroll });
    }
  }, [onScroll]);

  const handleScroll = useCallback((event) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const contentSize = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    // Calculate overscroll (when scrolling above the top)
    const overscrollValue = currentY < 0 ? Math.abs(currentY) : 0;

    if (currentY >= -200 && currentY < 5000) { // Allow negative values for overscroll
      const prevY = previousScrollY.value;
      const deltaY = currentY - prevY;

      // Calculate position-based progress (for hero)
      const maxScroll = 300;
      const positionProgress = Math.min(1, Math.max(0, currentY / maxScroll));

      // Check if we're near the bottom to prevent bounce direction changes
      const isNearBottom = currentY + layoutHeight >= contentSize - 50; // 50px buffer

      // Detect direction changes (for bottom nav)
      let directionValue = scrollDirection.value;

      // Reset to idle when at the very top
      if (currentY <= 5) {
        if (scrollDirection.value !== 0) {
          scrollDirection.value = 0;
          directionValue = 0;
        }
      } else if (Math.abs(deltaY) > 2 && !isNearBottom) {
        const newDirection = deltaY > 0 ? 1 : -1; // 1 = down, -1 = up
        if (scrollDirection.value !== newDirection) {
          scrollDirection.value = newDirection;
          directionValue = newDirection;
        }
      }

      // Send position, direction, and overscroll to parent
      runOnJS(updateParent)(positionProgress, directionValue, overscrollValue);

      previousScrollY.value = currentY;
    }
  }, [updateParent, previousScrollY, scrollDirection]);

  const renderImage = useCallback(({ item, index }) => {
    const column = index % 3;
    const isRightColumn = column === 2;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => console.log('Image pressed:', item.id)}
      >
        <Image
          source={item.uri}
          style={[
            styles.gridImage,
            {
              marginRight: isRightColumn ? 0 : 2,
              marginBottom: 2
            }
          ]}
        />
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = useCallback((item) => item.id, []);

  const headerComponent = useMemo(() => (
    <View>
      {/* Transparent space for hero */}
      <View style={{ height: GALLERY_START_TOP, backgroundColor: 'transparent' }} />
      {/* White background starts here for images */}
      <View style={{
        position: 'absolute',
        top: GALLERY_START_TOP,
        left: 0,
        right: 0,
        bottom: -10000, // Extend far down
        backgroundColor: '#FFFFFF',
        zIndex: -1
      }} />
    </View>
  ), []);

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
      style={[styles.gallery, { backgroundColor: 'transparent' }]}
    />
  );
};

const styles = StyleSheet.create({
  gallery: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10, // Above hero background, below top toolbar
  },
  gridContent: {
    backgroundColor: 'transparent',
  },
  row: {
    // Removed gap - using individual margins instead
  },
  gridImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    backgroundColor: '#F2F2F7',
    borderRadius: 2,
  },
});

export default Gallery;