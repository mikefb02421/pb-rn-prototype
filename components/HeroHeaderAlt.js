// HeroHeaderAlt.js - Alternative Hero Header Component
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedReaction,
  runOnJS,
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

const HeroHeaderAlt = ({ animationProgress, isSettingsOpen }) => {
  const [showInviteText, setShowInviteText] = useState(true);

  // Monitor animation progress to show/hide text
  useAnimatedReaction(
    () => animationProgress.value,
    (currentValue) => {
      runOnJS(setShowInviteText)(currentValue < 0.1);
    },
    [animationProgress]
  );
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
      [0, -52], // Move up less to align with other elements
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateX }, { translateY }],
    };
  });


  // Invite button container slides up
  const inviteButtonContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      animationProgress.value,
      [0, 1],
      [0, -52], // Move up less to align with hamburger center (60 - 8 = 52)
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  // Invite button shrinks to circle
  const inviteButtonStyle = useAnimatedStyle(() => {
    // Animate width from pill to circle
    const width = interpolate(
      animationProgress.value,
      [0, 1],
      [110, 44], // From pill width to circle width - increased pill width
      Extrapolate.CLAMP
    );

    // Animate padding
    const paddingHorizontal = interpolate(
      animationProgress.value,
      [0, 1],
      [20, 0], // More padding in pill state, none in circle
      Extrapolate.CLAMP
    );

    return {
      width,
      paddingHorizontal,
    };
  });


  return (
    <Animated.View style={[styles.heroContainer, heroStyle]}>
      {/* Background Image */}
      {!isSettingsOpen && (
        <Animated.Image
          source={{ uri: 'https://picsum.photos/800/400?random=1' }}
          style={[styles.heroBackground, backgroundStyle]}
          resizeMode="cover"
        />
      )}

      {/* Dark Overlay - Animated to fade with image */}
      {!isSettingsOpen && (
        <Animated.View style={[styles.darkOverlay, backgroundStyle]} />
      )}

      {/* Content Container */}
      <View style={styles.heroContent}>
        {/* Top Row - Hamburger Menu and Title */}
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            {/* Hamburger Menu - Never changes */}
            <View style={styles.hamburgerButton}>
              <Ionicons name="menu" size={36} color="#FFFFFF" />
            </View>
            {/* Title Text - Always visible */}
            <Animated.Text style={styles.heroTitle}>MTB Crew!</Animated.Text>
          </View>
        </View>

        {/* Fixed Spacer */}
        <View style={{ height: 8 }} />

        {/* Middle Row - Avatars and Invite Button */}
        <View style={styles.middleRow}>
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
          <Animated.View style={[styles.inviteButtonContainer, inviteButtonContainerStyle]}>
            <Animated.View
              style={[styles.inviteButton, inviteButtonStyle]}
            >
              <TouchableOpacity
                style={styles.inviteButtonTouchable}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <Ionicons name="person-add" size={18} color="#FFFFFF" />
                {showInviteText && (
                  <Text style={styles.inviteButtonText}>Invite</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
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
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // 30% black overlay
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

  // Avatars
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0,
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
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C47CB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inviteButtonTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  inviteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default HeroHeaderAlt;