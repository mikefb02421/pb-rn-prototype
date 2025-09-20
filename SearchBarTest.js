// Search Bar Test - Copy this file to snack.expo.dev
import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_SIZE = (screenWidth - 4) / 3; // 2px gaps between images
const SEARCH_BAR_HEIGHT = 62;

// Simple image data for testing
const generateImages = () => {
  const images = [];
  for (let i = 0; i < 40; i++) {
    images.push({
      id: i.toString(),
      uri: `https://picsum.photos/400/400?random=${i}`,
    });
  }
  return images;
};

const IMAGES_DATA = generateImages();

// Search Bar Component
const SearchBar = ({ visible }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isVisible = visible.value === 1;
    return {
      opacity: isVisible ? 1 : 0,
      transform: [
        {
          translateY: isVisible ? 0 : 50,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.searchContainer, animatedStyle]}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Find me the best photos of me...."
          placeholderTextColor="#8E8E93"
          autoCapitalize="none"
        />
        <Ionicons name="search" size={24} color="#8E8E93" style={styles.searchIcon} />
      </View>
    </Animated.View>
  );
};

// Simple Bottom Toolbar for Context
const SimpleBottomToolbar = ({ searchVisible }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: searchVisible.value === 1 ? -(SEARCH_BAR_HEIGHT + 10) : 0,
      },
    ],
  }));

  return (
    <Animated.View style={[styles.toolbarContainer, animatedStyle]}>
      <View style={styles.toolbar}>
        <View style={styles.toolbarContent}>
          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="home" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="images" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="search" size={24} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarItem}>
            <Ionicons name="people" size={24} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Main Test Component
export default function SearchBarTest() {
  const scrollY = useSharedValue(0);
  const searchVisible = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const flatListRef = useRef(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      scrollY.value = currentY;

      // Hide search bar on significant downward scroll
      const diff = currentY - lastScrollY.value;
      if (Math.abs(diff) > 15) {
        if (diff > 0) {
          // Scrolling down - hide search bar if visible
          if (searchVisible.value === 1 && Math.abs(diff) > 30) {
            searchVisible.value = 0;
          }
        }
        lastScrollY.value = currentY;
      }
    },
  });

  // Gesture for showing search bar
  const pullUpGesture = Gesture.Pan()
    .onEnd((event) => {
      'worklet';
      // Check for upward swipe
      if (event.translationY < -25 || event.velocityY < -250) {
        searchVisible.value = 1;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    });

  // Debug tap gesture
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      'worklet';
      searchVisible.value = searchVisible.value === 1 ? 0 : 1;
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    });

  const combinedGestures = Gesture.Race(pullUpGesture, tapGesture);

  const renderImage = useCallback(({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      >
        <Image source={{ uri: item.uri }} style={styles.gridImage} />
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = useCallback((item) => item.id, []);

  const footerComponent = useMemo(() => (
    <View style={{ height: 120 }} />
  ), []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <GestureDetector gesture={combinedGestures}>
        <Animated.FlatList
          ref={flatListRef}
          data={IMAGES_DATA}
          renderItem={renderImage}
          keyExtractor={keyExtractor}
          numColumns={3}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={footerComponent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={12}
          windowSize={5}
          initialNumToRender={12}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.row}
          inverted={true}
        />
      </GestureDetector>

      <SearchBar visible={searchVisible} />
      <SimpleBottomToolbar searchVisible={searchVisible} />

      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Search Bar Test</Text>
        <Text style={styles.debugText}>Swipe up or tap to show</Text>
        <Text style={styles.debugText}>Scroll down to hide</Text>
      </View>

      {/* Manual toggle button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => {
          searchVisible.value = searchVisible.value === 1 ? 0 : 1;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.toggleButtonText}>Toggle</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  debugInfo: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 100,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  toggleButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    backgroundColor: '#FF0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 100,
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
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
  searchContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    height: SEARCH_BAR_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#000000',
  },
  searchIcon: {
    marginLeft: 8,
  },
  toolbarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  toolbar: {
    width: screenWidth - 32,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  toolbarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  toolbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});