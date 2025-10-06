// HeroHeaderCover.js - Cover image hero header with overscroll zoom effect
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withRepeat,
  withTiming,
  Easing,
  Extrapolate,
} from 'react-native-reanimated';
import { List, House, UserPlus } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');

// Avatar data
const AVATARS = [
  { id: '1', type: 'image', uri: 'https://i.pravatar.cc/150?img=11' },
  { id: '2', type: 'text', initials: 'MS', color: '#9B59B6' },
  { id: '3', type: 'image', uri: 'https://i.pravatar.cc/150?img=13' },
];

const HeroHeaderCover = ({ overscroll, scrollProgress }) => {
  // Ken Burns effect animation values
  const kenBurnsProgress = useSharedValue(0);

  useEffect(() => {
    // Start Ken Burns effect - slow, continuous animation
    kenBurnsProgress.value = withRepeat(
      withTiming(1, {
        duration: 20000, // 20 seconds for one cycle
        easing: Easing.inOut(Easing.sin),
      }),
      -1, // infinite repeat
      true // reverse (back and forth)
    );
  }, [kenBurnsProgress]);

  // Animated styles for overscroll zoom effect combined with Ken Burns
  const imageStyle = useAnimatedStyle(() => {
    // Base Ken Burns effect - slow zoom and pan
    const baseKenBurnsScale = interpolate(
      kenBurnsProgress.value,
      [0, 1],
      [1.15, 1.25], // Base range 115% to 125%
      Extrapolate.CLAMP
    );

    // Scroll-responsive zoom reversal
    // When scrollProgress is provided, reverse the zoom effect
    let kenBurnsScale = baseKenBurnsScale;
    if (scrollProgress) {
      const scrollInfluence = interpolate(
        scrollProgress.value,
        [0, 1], // Use full scroll range for responsive effect
        [0, 0.15], // Reduce scale by up to 0.15 (from 1.25 down to 1.10 minimum)
        Extrapolate.CLAMP
      );
      // Apply scroll influence to reduce the Ken Burns scale
      kenBurnsScale = Math.max(1.10, baseKenBurnsScale - scrollInfluence);
    }

    const kenBurnsTranslateX = interpolate(
      kenBurnsProgress.value,
      [0, 1],
      [-25, 25], // More pronounced pan left to right
      Extrapolate.CLAMP
    );

    const kenBurnsTranslateY = interpolate(
      kenBurnsProgress.value,
      [0, 1],
      [-15, 15], // More noticeable vertical movement
      Extrapolate.CLAMP
    );

    // Overscroll effect (when user pulls down)
    let overscrollScale = 1;
    let overscrollTranslateY = 0;

    if (overscroll) {
      overscrollScale = interpolate(
        overscroll.value,
        [0, 100],
        [1, 1.15],
        Extrapolate.CLAMP
      );

      overscrollTranslateY = interpolate(
        overscroll.value,
        [0, 100],
        [0, 15],
        Extrapolate.CLAMP
      );
    }

    // Combine Ken Burns and overscroll effects
    const finalScale = kenBurnsScale * overscrollScale;
    const finalTranslateY = kenBurnsTranslateY + overscrollTranslateY;

    return {
      transform: [
        { scale: finalScale },
        { translateX: kenBurnsTranslateX },
        { translateY: finalTranslateY },
      ],
    };
  });

  const handlePress = (action) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Pressed:', action);
  };

  // Avatar component
  const Avatar = ({ avatar, index }) => {
    if (avatar.type === 'text') {
      return (
        <View style={[styles.avatar, { backgroundColor: avatar.color, marginLeft: index > 0 ? -8 : 0, zIndex: AVATARS.length - index }]}>
          <Text style={styles.avatarText}>{avatar.initials}</Text>
        </View>
      );
    }
    return (
      <Animated.Image
        source={{ uri: avatar.uri }}
        style={[styles.avatar, { marginLeft: index > 0 ? -8 : 0, zIndex: AVATARS.length - index }]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/dummy-moab-2.jpg')}
        style={[styles.coverImage, imageStyle]}
        resizeMode="cover"
      />

      {/* Title and Avatars - positioned at bottom of hero */}
      <View style={styles.bottomSection}>
        {/* Title */}
        <Text style={styles.title}>MTB Crew!</Text>

        {/* Avatar Stack */}
        <View style={styles.avatarStack}>
          {AVATARS.map((avatar, index) => (
            <Avatar key={avatar.id} avatar={avatar} index={index} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenWidth,
    zIndex: 5, // Lower z-index - gallery will go on top
    overflow: 'hidden', // Prevent image from extending beyond container
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  // Avatar stack
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Bottom section
  bottomSection: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
});

export default HeroHeaderCover;