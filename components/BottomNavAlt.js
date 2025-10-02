// BottomNavAlt.js - Alternative Bottom Navigation Component
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
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

const BottomNavAlt = ({ scrollDirection, onHomePress, isHomePageOpen, onSettingsPress, onMediaPress, activeTab: activeTabProp, isRightHanded }) => {
  const [activeTab, setActiveTab] = useState(activeTabProp || 'media');
  const shadowOpacity = useSharedValue(0);

  // Animate shadow when HomePage opens/closes
  useEffect(() => {
    if (isHomePageOpen) {
      // Add shadow for elevation
      shadowOpacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      // Remove shadow
      shadowOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [isHomePageOpen, shadowOpacity]);

  // Animate bottom nav based on scroll direction
  const bottomNavStyle = useAnimatedStyle(() => {
    // Don't hide when HomePage is open
    const shouldHide = !isHomePageOpen && scrollDirection && scrollDirection.value === 1;
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

  // Animated styles for home button container
  const homeContainerAnimatedStyle = useAnimatedStyle(() => {
    // Much stronger shadow when HomePage is open for visibility
    return {
      shadowOpacity: interpolate(shadowOpacity.value, [0, 1], [0.15, 0.6]),
      shadowRadius: interpolate(shadowOpacity.value, [0, 1], [12, 35]),
      shadowOffset: {
        width: 0,
        height: interpolate(shadowOpacity.value, [0, 1], [4, 15]),
      },
      elevation: interpolate(shadowOpacity.value, [0, 1], [8, 25]),
    };
  });

  // Update active tab when prop changes
  useEffect(() => {
    if (activeTabProp) {
      setActiveTab(activeTabProp);
    }
  }, [activeTabProp]);

  // Handle tab press with haptic feedback
  const handleTabPress = (tabName) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (tabName === 'home' && onHomePress) {
      onHomePress();
    } else if (tabName === 'settings' && onSettingsPress) {
      onSettingsPress();
    } else if (tabName === 'media' && onMediaPress) {
      onMediaPress();
    } else {
      setActiveTab(tabName);
    }
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle add action
  };

  const NavItem = ({ name, iconName, IconComponent = Ionicons, size = 24 }) => {
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

      {/* Main navigation pill - lower z-index, gets covered by HomePage */}
      <Animated.View style={[
        styles.mainNavContainer,
        isRightHanded ? styles.mainNavContainerRight : styles.mainNavContainerLeft,
        bottomNavStyle
      ]}>
        <BlurView intensity={80} tint="light" style={styles.mainBlurContainer}>
          <View style={styles.pillContainer}>
            <View style={styles.navItems}>
              {/* Media */}
              <NavItem name="media" iconName="images-outline" />

              {/* Albums */}
              <NavItem
                name="albums"
                iconName="albums-outline"
              />

              {/* Settings */}
              <NavItem name="settings" iconName="settings-outline" />

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
                  <Ionicons name="add" size={28} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      {/* Home button - higher z-index, always visible above HomePage */}
      <Animated.View style={[
        styles.homeButtonContainer,
        isRightHanded ? styles.homeButtonContainerRight : styles.homeButtonContainerLeft,
        bottomNavStyle
      ]}>
        <BlurView intensity={80} tint="light" style={styles.homeBlurContainer}>
          <Animated.View style={[
            styles.homeContainer,
            isHomePageOpen && styles.homeContainerOpen,
            homeContainerAnimatedStyle
          ]}>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => handleTabPress('home')}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isHomePageOpen ? "close" : "home"}
                size={24}
                color={isHomePageOpen ? '#000000' : (activeTab === 'home' ? '#1C47CB' : '#8E8E93')}
              />
            </TouchableOpacity>
          </Animated.View>
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
  mainNavContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    zIndex: 101, // Below HomePage (999)
  },
  mainNavContainerLeft: {
    left: 92, // Space for home button (60px) + gap (12px) + padding (20px)
    right: 20,
  },
  mainNavContainerRight: {
    left: 20,
    right: 92, // Space for home button (60px) + gap (12px) + padding (20px)
  },
  homeButtonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 34 : 20,
    zIndex: 1000, // Above HomePage (999)
  },
  homeButtonContainerLeft: {
    left: 20,
  },
  homeButtonContainerRight: {
    right: 20,
  },
  // Home button styles
  homeBlurContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 12, // Gap between home and main pill
  },
  homeContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // Base shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  homeButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeContainerOpen: {
    // Additional styles when HomePage is open
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 0.75,
    borderColor: 'rgba(0, 0, 0, 0.12)',
  },
  // Main pill styles
  mainBlurContainer: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  pillContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 20,
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
    height: 44,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    marginHorizontal: 2,
  },
  addButton: {
    width: 52,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  addButtonInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
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