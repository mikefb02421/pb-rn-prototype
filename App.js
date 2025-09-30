// App.js - Main App with Modular Components
import React from 'react';
import {
  StyleSheet,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import components
import HeroHeader from './components/HeroHeader';
import Gallery from './components/Gallery';
import BottomNav from './components/BottomNav';
import ScrollToolbar from './components/ScrollToolbar';

// Create animated version of LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function App() {
  const animationProgress = useSharedValue(0);
  const scrollDirection = useSharedValue(0); // For future bottom nav

  // Gradient animation style - fades in when scrolled
  const gradientStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animationProgress.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  // Handle scroll data from Gallery component
  const handleScroll = ({ position, direction }) => {
    // Hero uses position-based animation (smooth gradient based on scroll position)
    animationProgress.value = position;

    // Store direction for future bottom nav component
    scrollDirection.value = direction;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Photo Gallery */}
      <Gallery onScroll={handleScroll} headerHeight={168} />

      {/* Gradient Overlay - Appears when scrolled */}
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

      {/* Hero Header - On top of everything */}
      <HeroHeader animationProgress={animationProgress} />

      {/* Secondary Toolbar - Shows when scrolling down */}
      <ScrollToolbar scrollDirection={scrollDirection} />

      {/* Bottom Navigation - Hides when scrolling down */}
      <BottomNav scrollDirection={scrollDirection} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background for photo gallery
  },
  separateGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 350, // Extended height for smooth fade over photos
    zIndex: 5, // Above photos but below hero content
  },
});