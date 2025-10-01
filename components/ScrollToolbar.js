// ScrollToolbar.js - Secondary toolbar that appears when scrolling
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const ScrollToolbar = ({ scrollDirection }) => {
  // Animate toolbar - opposite of bottom nav (show when scrolling down)
  const toolbarStyle = useAnimatedStyle(() => {
    // Show when scrolling down (1), hide when scrolling up (-1) or idle (0)
    const shouldShow = scrollDirection && scrollDirection.value === 1;
    const translateY = withTiming(
      shouldShow ? 0 : 100, // Slide up from bottom when showing
      {
        duration: 650,
        easing: Easing.out(Easing.cubic),
      }
    );

    return {
      transform: [{ translateY }],
    };
  });

  const handleButtonPress = (action) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Handle different actions
    console.log('Pressed:', action);
  };

  return (
    <Animated.View style={[styles.container, toolbarStyle]}>
      <View style={styles.toolbar}>
          {/* Left side buttons */}
          <View style={styles.leftButtons}>
            {/* Filter button */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleButtonPress('filter')}
              activeOpacity={0.7}
            >
              <Ionicons name="filter" size={22} color="#1C47CB" />
            </TouchableOpacity>

            {/* Sort button */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleButtonPress('sort')}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="sort" size={22} color="#1C47CB" />
            </TouchableOpacity>

            {/* More options */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => handleButtonPress('more')}
              activeOpacity={0.7}
            >
              <Ionicons name="ellipsis-horizontal" size={22} color="#1C47CB" />
            </TouchableOpacity>
          </View>

          {/* Right side - Select button */}
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => handleButtonPress('select')}
            activeOpacity={0.7}
          >
            <Text style={styles.selectText}>Select</Text>
          </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    left: 16,
    right: 16,
    zIndex: 101, // Above gradient
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 26,
    height: 52, // Increased to accommodate larger touch targets
    paddingHorizontal: 6,
    marginRight: 44, // 44pt gap to select button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  selectButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 20,
    height: 52, // Matched to left pill height
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectText: {
    color: '#1C47CB',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ScrollToolbar;