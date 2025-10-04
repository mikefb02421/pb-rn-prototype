// App.js - Main App with Modular Components
import React from 'react';
import {
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import components
import HeroHeader from './components/HeroHeaderCover';
import Gallery from './components/Gallery';
import BottomNav from './components/BottomNav';
import ScrollToolbar from './components/ScrollToolbar';
import HomePage from './components/HomePageMask';
import BucketSettings from './components/BucketSettings';
import Collections from './components/Collections';
// import AnimationControls from './components/AnimationControls';

// Create animated version of LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function App() {
  const [isHomePageOpen, setIsHomePageOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = React.useState(false);
  const [isRightHanded, setIsRightHanded] = React.useState(false); // Default is left-handed
  // const [showControls, setShowControls] = React.useState(false);
  // const [animationConfig, setAnimationConfig] = React.useState(null);
  const animationProgress = useSharedValue(0);
  const scrollDirection = useSharedValue(0); // For future bottom nav
  const overscrollValue = useSharedValue(0); // For hero zoom effect

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
  const handleScroll = ({ position, direction, overscroll }) => {
    // Hero uses position-based animation (smooth gradient based on scroll position)
    animationProgress.value = position;

    // Store direction for future bottom nav component
    scrollDirection.value = direction;

    // Store overscroll for hero zoom effect
    overscrollValue.value = overscroll || 0;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Photo Gallery - Hidden when settings, collections, or home page is open */}
      {!isSettingsOpen && !isCollectionsOpen && <Gallery onScroll={handleScroll} headerHeight={screenWidth} />}

      {/* Gradient Overlay - Appears when scrolled, hidden when settings or collections is open */}
      {!isSettingsOpen && !isCollectionsOpen && (
        <AnimatedLinearGradient
        colors={[
          'rgba(0, 0, 0, 0.7)',  // Much darker at top for hamburger menu clarity
          'rgba(0, 0, 0, 0.6)',   // Dark
          'rgba(0, 0, 0, 0.4)',   // Medium-dark
          'rgba(0, 0, 0, 0.3)',   // Medium
          'rgba(0, 0, 0, 0.15)',  // Light
          'rgba(0, 0, 0, 0.08)',  // Very light
          'rgba(0, 0, 0, 0.04)',  // Extremely light
          'rgba(0, 0, 0, 0.02)',  // Almost nothing
          'rgba(0, 0, 0, 0.01)',  // Barely there
          'transparent'           // Fully transparent at bottom
        ]}
        locations={[0, 0.2, 0.35, 0.5, 0.65, 0.75, 0.85, 0.92, 0.97, 1]}
        style={[styles.separateGradient, gradientStyle]}
        pointerEvents="none"
        />
      )}

      {/* Hero Header - On top of everything */}
      <HeroHeader
        animationProgress={animationProgress}
        isSettingsOpen={isSettingsOpen || isCollectionsOpen}
        overscroll={overscrollValue}
      />

      {/* Secondary Toolbar - Shows when scrolling down */}
      {!isHomePageOpen && !isSettingsOpen && !isCollectionsOpen && <ScrollToolbar scrollDirection={scrollDirection} />}

      {/* Bottom Navigation - Always visible, handles open/close */}
      <BottomNav
        scrollDirection={scrollDirection}
        isHomePageOpen={isHomePageOpen}
        onHomePress={() => setIsHomePageOpen(!isHomePageOpen)}
        onSettingsPress={() => {
          setIsSettingsOpen(!isSettingsOpen);
          setIsCollectionsOpen(false);
        }}
        onMediaPress={() => {
          setIsSettingsOpen(false);
          setIsCollectionsOpen(false);
        }}
        onCollectionsPress={() => {
          setIsCollectionsOpen(!isCollectionsOpen);
          setIsSettingsOpen(false);
        }}
        activeTab={isSettingsOpen ? 'settings' : isCollectionsOpen ? 'collections' : 'media'}
        isRightHanded={isRightHanded}
      />

      {/* Home Page - Expands from bottom-left */}
      <HomePage
        isVisible={isHomePageOpen}
        onClose={() => setIsHomePageOpen(false)}
      />

      {/* Bucket Settings Page */}
      <BucketSettings
        isVisible={isSettingsOpen}
        isRightHanded={isRightHanded}
        onHandednessChange={setIsRightHanded}
      />

      {/* Collections Page */}
      <Collections
        isVisible={isCollectionsOpen}
      />
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
    height: 180, // Reduced height
    zIndex: 5, // Above photos but below hero content
  },
});