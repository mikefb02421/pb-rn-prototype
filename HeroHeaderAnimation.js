// Hero Header Animation - Copy this file to snack.expo.dev
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
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_SIZE = (screenWidth - 4) / 3; // 2px gaps between images

// Animation constants
const HERO_EXPANDED_HEIGHT = 156;
const HERO_COMPACT_HEIGHT = 90;
const SCROLL_ANIMATION_RANGE = 100;

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
  { id: '4', uri: 'https://i.pravatar.cc/150?img=14' },
];


// Animated Hero Header Component
const AnimatedHeroHeader = ({ scrollY }) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Remove fixed height constraint - let content determine size
    return {};
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, SCROLL_ANIMATION_RANGE],
      [0, 1],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      progress,
      [0, 1],
      [1, 1.2],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      progress,
      [0, 1],
      [0, -10],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale },
        { translateY },
      ],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, SCROLL_ANIMATION_RANGE],
      [0, 1],
      Extrapolate.CLAMP
    );

    const fontSize = interpolate(
      progress,
      [0, 1],
      [24, 18],
      Extrapolate.CLAMP
    );

    return {
      fontSize: withTiming(fontSize, {
        duration: 250,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }),
    };
  });

  const avatarsStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, SCROLL_ANIMATION_RANGE * 0.7],
      [0, 1],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      progress,
      [0, 1],
      [1, 0],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      progress,
      [0, 1],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      opacity: withTiming(opacity, {
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }),
      transform: [
        {
          scale: withTiming(scale, {
            duration: 200,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          }),
        },
      ],
    };
  });

  const inviteButtonPositionStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_ANIMATION_RANGE],
      [0, -52], // Move up to perfectly align with hamburger menu center
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });




  const currentTitle = scrollY.value > SCROLL_ANIMATION_RANGE * 0.5
    ? "MTB Crew!"
    : "MTB Crew! Extended...";

  const iconColor = scrollY.value > SCROLL_ANIMATION_RANGE * 0.5 ? '#1C47CB' : '#FFFFFF';

  return (
    <Animated.View style={[styles.heroContainer, animatedStyle]}>
      {/* Background Image */}
      <Animated.Image
        source={{ uri: 'https://picsum.photos/800/400?random=hero' }}
        style={[styles.heroBackground, backgroundStyle]}
        resizeMode="cover"
      />

      {/* Gradient Overlay */}
      <View style={styles.heroGradient} />

      {/* Content Container */}
      <View style={styles.heroContent}>
        {/* Title Row - with more space above for Dynamic Island */}
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            {/* Static Menu Icon - no animation */}
            <View style={styles.menuIconContainer}>
              <Ionicons name="menu" size={36} color="#FFFFFF" />
            </View>

            {/* Animated Title */}
            <Animated.Text style={[styles.heroTitle, titleStyle]}>
              {currentTitle}
            </Animated.Text>
          </View>

        </View>

        {/* Bottom Row - Avatars only (fade out when scrolled) */}
        <Animated.View style={[styles.bottomRow, avatarsStyle]} pointerEvents="none">
          <View style={styles.avatarsContainer}>
            {AVATARS.map((avatar, index) => (
              <Image
                key={avatar.id}
                source={{ uri: avatar.uri }}
                style={[
                  styles.avatar,
                  {
                    marginLeft: index > 0 ? -12 : 0,
                    zIndex: AVATARS.length - index,
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>

        {/* Invite button - separate from avatars so it doesn't fade */}
        <Animated.View style={[styles.inviteButtonWrapper, inviteButtonPositionStyle]} pointerEvents="none">
          <View style={styles.expandedInviteButton}>
            <Ionicons name="person-add" size={16} color="#FFFFFF" />
            <Text style={styles.inviteText}>Invite</Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

// Bottom Navigation Component
const BottomNavigation = () => (
  <View style={styles.bottomNav}>
    <TouchableOpacity style={styles.navItem} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
      <Ionicons name="home" size={24} color="#007AFF" />
      <Text style={styles.navLabel}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
      <Ionicons name="search" size={24} color="#8E8E93" />
      <Text style={styles.navLabel}>Search</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
      <Ionicons name="people" size={24} color="#8E8E93" />
      <Text style={styles.navLabel}>People</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.navItem} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
      <Ionicons name="albums" size={24} color="#8E8E93" />
      <Text style={styles.navLabel}>Albums</Text>
    </TouchableOpacity>
  </View>
);

// Main Component
export default function HeroHeaderAnimation() {
  const scrollY = useSharedValue(0);
  const flatListRef = useRef(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Now scrollY increases as user scrolls down (normal direction)
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: () => {
      // Provide haptic feedback at key transition points
      if (scrollY.value > SCROLL_ANIMATION_RANGE * 0.8 && scrollY.value < SCROLL_ANIMATION_RANGE * 1.2) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
  });

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
    <View style={{ height: HERO_EXPANDED_HEIGHT + 20 }} />
  ), []);

  const footerComponent = useMemo(() => (
    <View style={{ height: 100 }} />
  ), []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated Hero Header */}
      <AnimatedHeroHeader scrollY={scrollY} />

      {/* Photo Grid */}
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
        removeClippedSubviews={true}
        maxToRenderPerBatch={12}
        windowSize={5}
        initialNumToRender={12}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.row}
        inverted={false}
        contentInsetAdjustmentBehavior="never"
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },

  // Hero Header Styles
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#535E70',
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    overflow: 'hidden',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    gap: 16,
  },

  // Header Content Styles
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 58 : 38, // Space for Dynamic Island and status bar + 8pt
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    marginRight: 8,
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 21,
    color: '#FFFFFF',
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  expandedInviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C47CB',
    paddingHorizontal: 16,
    paddingVertical: 0, // Remove vertical padding to match hamburger height
    borderRadius: 18,
    height: 36,
    gap: 8,
  },
  inviteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom Row Styles (Avatars + Invite Button on same line)
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inviteButtonWrapper: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  avatarsContainer: {
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

  // Bottom Navigation Styles
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingBottom: Platform.OS === 'ios' ? 34 : 10,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
});