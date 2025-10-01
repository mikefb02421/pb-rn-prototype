// BottomNavAlt.js - Alternative Bottom Navigation Component
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');

const BottomNavAlt = ({ scrollDirection, onHomePress }) => {
  const [activeTab, setActiveTab] = useState('media');

  // Animate bottom nav based on scroll direction
  const bottomNavStyle = useAnimatedStyle(() => {
    // Show by default (0 or -1), hide when scrolling down (1)
    const shouldHide = scrollDirection && scrollDirection.value === 1;
    const translateY = withTiming(
      shouldHide ? 120 : 0,
      {
        duration: 650, // Slowed down for smoother transition
        easing: Easing.out(Easing.cubic),
      }
    );

    return {
      transform: [{ translateY }],
    };
  });

  // Handle tab press with haptic feedback
  const handleTabPress = (tabName) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (tabName === 'home' && onHomePress) {
      onHomePress();
    } else {
      setActiveTab(tabName);
    }
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle add action
  };

  const NavItem = ({ name, iconName, IconComponent = Ionicons, size = 26 }) => {
    const isActive = activeTab === name;

    return (
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => handleTabPress(name)}
        activeOpacity={0.7}
      >
        <IconComponent
          name={iconName}
          size={size}
          color={isActive ? '#1C47CB' : '#8E8E93'}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {/* Full-width gradient overlay - always visible, not animated */}
      <LinearGradient
        colors={[
          'transparent',           // Fully transparent at top
          'rgba(0, 0, 0, 0.01)',  // Barely there
          'rgba(0, 0, 0, 0.02)',  // Almost nothing
          'rgba(0, 0, 0, 0.04)',  // Extremely light
          'rgba(0, 0, 0, 0.08)',  // Very light
          'rgba(0, 0, 0, 0.15)',  // Light
          'rgba(0, 0, 0, 0.3)',   // Medium
          'rgba(0, 0, 0, 0.5)',   // Medium-dark
          'rgba(0, 0, 0, 0.7)',   // Dark
          'rgba(0, 0, 0, 0.75)',  // Much darker at bottom
        ]}
        locations={[0, 0.03, 0.08, 0.15, 0.25, 0.35, 0.5, 0.65, 0.8, 1]}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />

      {/* Two-part navigation - animated together */}
      <Animated.View style={[styles.navContainer, bottomNavStyle]}>
        {/* Home button - separate circular toolbar */}
        <BlurView intensity={80} tint="light" style={styles.homeBlurContainer}>
          <View style={styles.homeContainer}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => handleTabPress('home')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="home"
                size={28}
                color={activeTab === 'home' ? '#1C47CB' : '#8E8E93'}
              />
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Main navigation pill */}
        <BlurView intensity={80} tint="light" style={styles.blurContainer}>
          <View style={styles.pillContainer}>
            <View style={styles.navItems}>
              {/* Media */}
              <NavItem name="media" iconName="images-outline" size={26} />

              {/* Albums */}
              <NavItem
                name="albums"
                iconName="albums-outline"
                size={26}
              />

              {/* Settings */}
              <NavItem name="settings" iconName="settings-outline" size={26} />

              {/* Add Button - Special styling */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddPress}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#1C47CB', '#02E39F']}
                  style={styles.addButtonInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="add" size={32} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200, // Extended gradient area
    zIndex: 100, // Below navigation pills
  },
  navContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20, // Account for safe area
    left: 20,
    right: 20,
    zIndex: 101, // Above gradient
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Home button styles
  homeBlurContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    marginRight: 12, // Gap between home and main pill
  },
  homeContainer: {
    width: 72,
    height: 72,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  homeButton: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Main pill styles
  blurContainer: {
    flex: 1,
    borderRadius: 35,
    overflow: 'hidden',
  },
  pillContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 35,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginHorizontal: 2,
  },
  addButton: {
    width: 56,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1C47CB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default BottomNavAlt;