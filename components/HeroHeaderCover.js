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

const HeroHeaderCover = ({ overscroll }) => {
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
    // Ken Burns effect - slow zoom and pan
    const kenBurnsScale = interpolate(
      kenBurnsProgress.value,
      [0, 1],
      [1.15, 1.25], // More subtle effect - 115% to 125%
      Extrapolate.CLAMP
    );

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
        source={{ uri: 'https://picsum.photos/800/800?random=1' }}
        style={[styles.coverImage, imageStyle]}
        resizeMode="cover"
      />

      {/* Header Overlay Content */}
      <View style={styles.headerOverlay}>
        {/* Top Row */}
        <View style={styles.topRow}>
          {/* Hamburger Menu */}
          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={() => handlePress('hamburger')}
            activeOpacity={0.7}
          >
            <List size={28} color="#FFFFFF" weight="fill" />
          </TouchableOpacity>

          {/* Home Button */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => handlePress('home')}
            activeOpacity={0.7}
          >
            <House size={24} color="#FFFFFF" weight="fill" />
          </TouchableOpacity>

          {/* Invite Button */}
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => handlePress('add-user')}
            activeOpacity={0.7}
          >
            <UserPlus size={18} color="#FFFFFF" weight="fill" />
          </TouchableOpacity>
        </View>

        {/* Bottom Section - Title and Avatars */}
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
    zIndex: 10,
    overflow: 'hidden', // Prevent image from extending beyond container
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Hamburger menu
  hamburgerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 22,
  },
  // Home button
  homeButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C47CB',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  // Invite button
  inviteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C47CB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
    alignSelf: 'flex-start',
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