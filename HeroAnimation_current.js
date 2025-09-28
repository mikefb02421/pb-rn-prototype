// Hero Animation V2 with Gradient - Copy this file to snack.expo.dev
//
// IMPORTANT: In Expo Snack, if you get an error about expo-linear-gradient:
// 1. Try refreshing the Snack page
// 2. Or add "expo-linear-gradient": "~13.0.2" to dependencies in package.json
// 3. The library should auto-install when you import it
//
// If it still doesn't work, use HeroAnimationV2_Final.js which has a fallback gradient
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
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_SIZE = (screenWidth - 4) / 3; // 2px gaps between images

// Create animated version of LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

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

// Avatar data with placeholder images
const AVATARS = [
  { id: '1', uri: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', uri: 'https://i.pravatar.cc/150?img=12' },
  { id: '3', uri: 'https://i.pravatar.cc/150?img=13' },
];

// Animated Hero Header Component V2
const AnimatedHeroHeaderV2 = ({ animationProgress }) => {

  // Hero container height - stays constant
  const heroStyle = useAnimatedStyle(() => {
    // Use transparent background so gradient shows through to images
    return {
      height: 180, // Fixed height in both states
      backgroundColor: 'transparent'
    };
  });

  // Background image fade out
  const backgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 1],
      [1, 0],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  // Gradient overlay that appears when image fades
  const gradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  // Title text fade out
  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 1],
      [1, 0],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  // Avatar stack disappear
  const avatarsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 1],
      [1, 0],
      Extrapolate.CLAMP
    );

    const translateX = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 100],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  // Search bar container animation - position and width
  const searchBarContainerStyle = useAnimatedStyle(() => {
    // Move right to make space after hamburger
    const translateX = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 56], // Hamburger (44) + gap (12)
      Extrapolate.CLAMP
    );

    // Move up to align with title row
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [0, -60], // Move up to hamburger menu level
      Extrapolate.CLAMP
    );

    // Expand width to fill available space with 12pt gaps
    // Final width: screenWidth - padding(32) - hamburger(44) - gaps(24) - invite(44) = screenWidth - 144
    const width = interpolate(
      animationProgress.value,
      [0, 1],
      [200, screenWidth - 144], // Start at default width, expand to fill
      Extrapolate.CLAMP
    );

    return {
      width,
      transform: [{ translateX }, { translateY }],
    };
  });

  // Invite button slides up
  const inviteButtonStyle = useAnimatedStyle(() => {
    // Same vertical movement as search bar to align with hamburger
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [0, -60], // Move up to hamburger menu level
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[styles.heroContainer, heroStyle]}>
      {/* Background Image */}
      <Animated.Image
        source={{ uri: 'https://picsum.photos/800/400?random=hero' }}
        style={[styles.heroBackground, backgroundStyle]}
        resizeMode="cover"
      />


      {/* Content Container */}
      <View style={styles.heroContent}>
        {/* Top Row - Hamburger Menu and Title */}
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            {/* Hamburger Menu - Never changes */}
            <View style={styles.hamburgerButton}>
              <Ionicons name="menu" size={36} color="#FFFFFF" />
            </View>
            {/* Title Text - Fades out */}
            <Animated.Text style={[styles.heroTitle, titleStyle]}>MTB Crew!</Animated.Text>
          </View>
        </View>

        {/* Fixed Spacer */}
        <View style={{ height: 16 }} />

        {/* Middle Row - Search Bar and Avatars */}
        <View style={styles.middleRow}>
          {/* Search Bar */}
          <Animated.View style={[styles.searchBarContainer, searchBarContainerStyle]}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={16} color="#007AFF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search MTB Crew!"
                placeholderTextColor="#8E8E93"
                editable={false}
              />
            </View>
          </Animated.View>

          {/* Avatar Stack */}
          <Animated.View style={[styles.avatarsContainer, avatarsStyle]} pointerEvents="none">
            {AVATARS.map((avatar, index) => (
              <Image
                key={avatar.id}
                source={{ uri: avatar.uri }}
                style={[
                  styles.avatar,
                  {
                    marginLeft: index > 0 ? -8 : 0,
                    zIndex: AVATARS.length - index,
                  },
                ]}
              />
            ))}
          </Animated.View>

          {/* Invite Button */}
          <Animated.View style={[styles.inviteButtonContainer, inviteButtonStyle]}>
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Ionicons name="person-add" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

// Main Component
export default function HeroAnimationV2() {
  const scrollY = useSharedValue(0);
  const animationProgress = useSharedValue(0);
  const flatListRef = useRef(null);

  // Gradient animation style - same as used in hero component
  const gradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      if (currentY >= 0 && currentY < 5000) {
        scrollY.value = currentY;

        // Animation completes after 300px of scroll
        const maxScroll = 300;
        const newProgress = Math.min(1, Math.max(0, currentY / maxScroll));
        animationProgress.value = newProgress;
      }
    },
  });

  const handleScrollEndDrag = useCallback(() => {
    if (animationProgress.value > 0.8) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [animationProgress]);

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

  const headerComponent = useMemo(() => (
    <View style={{ height: 190 }} />
  ), []);

  const footerComponent = useMemo(() => (
    <View style={{ height: 100 }} />
  ), []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Photo Grid */}
      <Animated.FlatList
        ref={flatListRef}
        data={IMAGES_DATA}
        renderItem={renderImage}
        keyExtractor={keyExtractor}
        numColumns={3}
        onScroll={scrollHandler}
        onScrollEndDrag={handleScrollEndDrag}
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
        inverted={false}
        bounces={true}
        bouncesZoom={false}
        contentInsetAdjustmentBehavior="never"
      />

      {/* Separate Gradient Overlay - Outside hero container */}
      <AnimatedLinearGradient
        colors={[
          'rgba(0, 0, 0, 0.9)',   // Much darker at top for hamburger menu clarity
          'rgba(0, 0, 0, 0.7)',   // Dark
          'rgba(0, 0, 0, 0.5)',   // Medium-dark
          'rgba(0, 0, 0, 0.3)',   // Medium
          'rgba(0, 0, 0, 0.15)',  // Light
          'rgba(0, 0, 0, 0.08)',  // Very light
          'rgba(0, 0, 0, 0.04)',  // Extremely light
          'rgba(0, 0, 0, 0.02)',  // Almost nothing
          'rgba(0, 0, 0, 0.01)',  // Barely there
          'transparent'           // Fully transparent
        ]}
        locations={[0, 0.2, 0.35, 0.5, 0.65, 0.75, 0.85, 0.92, 0.97, 1]}
        style={[styles.separateGradient, gradientStyle]}
        pointerEvents="none"
      />

      {/* Animated Hero Header - On top of everything */}
      <AnimatedHeroHeaderV2 animationProgress={animationProgress} />

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background for photo gallery
  },

  // Hero Header Styles
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    // No background color - let gradient show through
    overflow: 'visible', // Allow gradient to extend beyond
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  separateGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350, // Extended height for smooth fade over photos
    zIndex: 5, // Above photos but below hero content
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    justifyContent: 'flex-start',
    paddingBottom: 8,
  },

  // Title Row
  titleRow: {
    marginBottom: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heroTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Middle Row
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Search Bar
  searchBarContainer: {
    // Width controlled by animation
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },

  // Avatars
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 52, // Reduced space - still prevents overlap but closer
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // Invite Button
  inviteButtonContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  inviteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Grid Styles
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