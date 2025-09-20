// Expo Snack Version - Copy this entire file to snack.expo.dev
import React, { useState, useRef, useCallback, useMemo } from 'react';
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
  FadeIn,
} from 'react-native-reanimated';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_SIZE = (screenWidth - 4) / 3; // 2px gaps between images
const HEADER_HEIGHT = 156;
const MINIMAL_HEADER_HEIGHT = 130;
const TOOLBAR_HEIGHT = 128;
const SEARCH_BAR_HEIGHT = 62;

// Mountain biking themed images with picsum for reliability
const generateImages = () => {
  const images = [];
  for (let i = 0; i < 60; i++) {
    images.push({
      id: i.toString(),
      uri: `https://picsum.photos/400/400?random=${i}`,
    });
  }
  return images;
};

const IMAGES_DATA = generateImages();

// Avatar data
const AVATARS = [
  { id: '1', uri: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', uri: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', uri: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', uri: 'https://i.pravatar.cc/150?img=4' },
];

// Hero Header Component
const HeroHeader = ({ headerState }) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Hero header only shows when headerState is 0 (at bottom of inverted list)
    const opacity = headerState.value === 0 ? 1 : 0;
    const translateY = headerState.value === 0 ? 0 : -HEADER_HEIGHT;

    return {
      opacity: withTiming(opacity, { duration: 350 }),
      transform: [
        {
          translateY: withTiming(translateY, { duration: 350 }),
        },
      ],
    };
  });

  const minimalHeaderStyle = useAnimatedStyle(() => {
    // Minimal header shows when scrolling (headerState is 1)
    const opacity = headerState.value === 1 ? 1 : 0;

    return {
      opacity: withTiming(opacity, { duration: 200 }),
    };
  });

  return (
    <>
      {/* Hero Header */}
      <Animated.View style={[styles.heroHeader, animatedStyle]}>
        <Image
          source={{ uri: 'https://picsum.photos/800/400?random=hero' }}
          style={styles.heroBackground}
          resizeMode="cover"
        />
        {/* Gradient overlay */}
        <View style={styles.heroGradient} />
        <View style={styles.heroOverlay}>
          <View style={styles.heroTitleContainer}>
            <Ionicons name="menu" size={28} color="#FFFFFF" style={styles.heroMenuIcon} />
            <Text style={styles.heroTitle}>MTB Crew!</Text>
          </View>
          <View style={styles.heroBottom}>
            <View style={styles.avatarContainer}>
              {AVATARS.map((avatar, index) => (
                <Animated.Image
                  key={avatar.id}
                  source={{ uri: avatar.uri }}
                  style={[
                    styles.avatar,
                    {
                      marginLeft: index > 0 ? -12 : 0,
                      zIndex: AVATARS.length - index,
                    },
                  ]}
                  entering={FadeIn.delay(index * 50)}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Ionicons name="person-add" size={18} color="#FFFFFF" />
              <Text style={styles.inviteText}>Invite</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Minimal Header */}
      <Animated.View style={[styles.minimalHeader, minimalHeaderStyle]} pointerEvents="box-none">
        <View style={styles.minimalHeaderGradient} />
        <View style={styles.minimalHeaderContent}>
          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.minimalTitle}>MTB Crew!</Text>
          <TouchableOpacity
            style={styles.addPersonButton}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Ionicons name="person-add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

// Bottom Toolbar Component
const BottomToolbar = ({ onAddPress, searchVisible }) => {
  const [activeTab, setActiveTab] = useState('gallery');

  const handleTabPress = (tab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: searchVisible.value ? -(SEARCH_BAR_HEIGHT + 10) : 0,
      },
    ],
  }));

  return (
    <Animated.View style={[styles.toolbarContainer, animatedStyle]}>
      {/* Multiple blur layers to create gradient effect */}
      <BlurView intensity={25} tint="light" style={styles.toolbarBackgroundBlurBottom} />
      <BlurView intensity={15} tint="light" style={styles.toolbarBackgroundBlurMiddle} />
      <BlurView intensity={5} tint="light" style={styles.toolbarBackgroundBlurTop} />

      {/* White pill on top */}
      <View style={styles.toolbarPill}>
        <View style={styles.toolbarContent}>
          <TouchableOpacity
            onPress={() => handleTabPress('home')}
            style={styles.toolbarItem}
          >
            <Ionicons
              name="home"
              size={24}
              color={activeTab === 'home' ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('gallery')}
            style={styles.toolbarItem}
          >
            <Ionicons
              name="images"
              size={24}
              color={activeTab === 'gallery' ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onAddPress();
            }}
            style={styles.addButton}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('search')}
            style={styles.toolbarItem}
          >
            <Ionicons
              name="search"
              size={24}
              color={activeTab === 'search' ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('people')}
            style={styles.toolbarItem}
          >
            <Ionicons
              name="people"
              size={24}
              color={activeTab === 'people' ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

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

// Main Gallery Component
export default function App() {
  const scrollY = useSharedValue(0);
  const headerState = useSharedValue(0); // 0: hero, 1: minimal
  const searchVisible = useSharedValue(0); // Start hidden
  const lastScrollY = useSharedValue(0);
  const scrollDirection = useSharedValue(0); // 0: none, 1: up, -1: down
  const flatListRef = useRef(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      // For inverted list, scrollY 0 means we're at the bottom (newest photos)
      scrollY.value = currentY;

      // Determine scroll direction
      const diff = currentY - lastScrollY.value;
      if (Math.abs(diff) > 15) { // Increased threshold to prevent immediate hiding
        if (diff > 0) {
          // Scrolling down in inverted list (viewing older photos)
          scrollDirection.value = -1;
          // Only hide search bar if user is actively scrolling down significantly
          if (searchVisible.value === 1 && Math.abs(diff) > 30) {
            searchVisible.value = 0;
          }
        } else {
          // Scrolling up in inverted list (viewing newer photos)
          scrollDirection.value = 1;
        }
        lastScrollY.value = currentY;
      }

      // Update header state - only show hero when at the very bottom (newest photos)
      // In inverted FlatList, bottom is when scrollY is near 0
      if (currentY < 20) {
        headerState.value = 0; // Show hero header
      } else {
        headerState.value = 1; // Show minimal header
      }
    },
  });

  // Gesture for pulling up to show search
  const pullUpGesture = Gesture.Pan()
    .onEnd((event) => {
      'worklet';
      // Check for upward swipe - more lenient detection
      if (event.translationY < -25 || event.velocityY < -250) {
        searchVisible.value = 1;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
    });

  // Alternative: single tap gesture for testing
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      'worklet';
      if (searchVisible.value === 0) {
        searchVisible.value = 1;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      }
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

  const getItemLayout = useCallback((_, index) => ({
    length: IMAGE_SIZE,
    offset: IMAGE_SIZE * Math.floor(index / 3),
    index,
  }), []);

  const headerComponent = useMemo(() => (
    <View style={{ height: HEADER_HEIGHT + 20 }} />
  ), []);

  const footerComponent = useMemo(() => (
    <View style={{ height: 100 }} />
  ), []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Debug button - temporary */}
      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => {
          searchVisible.value = searchVisible.value === 1 ? 0 : 1;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
      >
        <Text style={styles.debugButtonText}>Toggle Search</Text>
      </TouchableOpacity>

      <HeroHeader headerState={headerState} />

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
          ListHeaderComponent={headerComponent}
          ListFooterComponent={footerComponent}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={12}
          windowSize={5}
          initialNumToRender={12}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.row}
          inverted={true}
          contentInsetAdjustmentBehavior="never"
        />
      </GestureDetector>

      <SearchBar visible={searchVisible} />

      <BottomToolbar
        onAddPress={() => console.log('Add pressed')}
        searchVisible={searchVisible}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  debugButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    backgroundColor: '#FF0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 100,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 10,
    backgroundColor: '#2C5F2D', // Fallback green color
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: HEADER_HEIGHT,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark gradient overlay
  },
  heroOverlay: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    justifyContent: 'space-between',
  },
  heroTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroMenuIcon: {
    marginTop: 4,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  inviteText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  minimalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: MINIMAL_HEADER_HEIGHT,
    zIndex: 10,
  },
  minimalHeaderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark tint overlay
  },
  minimalHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  hamburgerButton: {
    padding: 8,
  },
  minimalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text on dark background
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  addPersonButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  toolbarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  toolbarBackgroundBlurBottom: {
    position: 'absolute',
    top: 20,
    left: -20,
    right: -20,
    bottom: -20,
  },
  toolbarBackgroundBlurMiddle: {
    position: 'absolute',
    top: -10,
    left: -20,
    right: -20,
    bottom: 10,
  },
  toolbarBackgroundBlurTop: {
    position: 'absolute',
    top: -30,
    left: -20,
    right: -20,
    bottom: 30,
  },
  toolbarPill: {
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
});