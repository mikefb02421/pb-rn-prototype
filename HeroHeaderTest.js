// Hero Header Test - Copy this file to snack.expo.dev
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
  withTiming,
  useAnimatedScrollHandler,
  FadeIn,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_SIZE = (screenWidth - 4) / 3; // 2px gaps between images
const HEADER_HEIGHT = 156;
const MINIMAL_HEADER_HEIGHT = 130;

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

// Main Test Component
export default function HeroHeaderTest() {
  const scrollY = useSharedValue(0);
  const headerState = useSharedValue(0); // 0: hero, 1: minimal
  const flatListRef = useRef(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;
      scrollY.value = currentY;

      // Update header state - only show hero when at the very bottom (newest photos)
      // In inverted FlatList, bottom is when scrollY is near 0
      if (currentY < 20) {
        headerState.value = 0; // Show hero header
      } else {
        headerState.value = 1; // Show minimal header
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
    <View style={{ height: HEADER_HEIGHT + 20 }} />
  ), []);

  const footerComponent = useMemo(() => (
    <View style={{ height: 100 }} />
  ), []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <HeroHeader headerState={headerState} />

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
        inverted={true}
        contentInsetAdjustmentBehavior="never"
      />

      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Hero Header Test</Text>
        <Text style={styles.debugText}>Scroll to see state transitions</Text>
      </View>
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
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 100,
  },
  debugText: {
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
});