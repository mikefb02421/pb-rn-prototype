// HeroHeader.js - Standalone Hero Header Component
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInput,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Avatar data with placeholder images
const AVATARS = [
  { id: '1', uri: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', uri: 'https://i.pravatar.cc/150?img=12' },
  { id: '3', uri: 'https://i.pravatar.cc/150?img=13' },
];

const HeroHeader = ({ animationProgress }) => {
  // Hero container height - stays constant
  const heroStyle = useAnimatedStyle(() => {
    return {
      height: 168, // Reduced by 12px (8pt spacer + 4pt padding reduction)
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

  // Avatar stack disappear - slide up and right
  const avatarsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 0.5], // Fade out by halfway point
      [1, 0],
      Extrapolate.CLAMP
    );

    const translateX = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 100],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [0, -60], // Move up to match other elements
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateX }, { translateY }],
    };
  });

  // Search bar container animation - position and width
  const searchBarContainerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 56], // Hamburger (44) + gap (12)
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [0, -60], // Move up to hamburger menu level
      Extrapolate.CLAMP
    );

    const width = interpolate(
      animationProgress.value,
      [0, 1],
      [200, screenWidth - 32 - 44 - 12 - 44 - 8], // Screen - padding - hamburger - gap - invite - gap
      Extrapolate.CLAMP
    );

    return {
      width,
      transform: [{ translateX }, { translateY }],
    };
  });

  // Invite button slides up
  const inviteButtonStyle = useAnimatedStyle(() => {
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
        <View style={{ height: 8 }} />

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

const styles = StyleSheet.create({
  // Hero Header Styles
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'visible',
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    justifyContent: 'flex-start',
    paddingBottom: 4, // Cut in half
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
    marginRight: 52,
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
});

export default HeroHeader;