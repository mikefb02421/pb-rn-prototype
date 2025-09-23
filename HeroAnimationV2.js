  // Hero Animation V2 - Copy this file to snack.expo.dev
  import React, { useRef, useCallback, useMemo } from 'react';
  import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    StatusBar,
    Platform,
    TextInput,
  } from 'react-native';
  import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    interpolate,
    Extrapolate,
  } from 'react-native-reanimated';
  import { GestureHandlerRootView } from 'react-native-gesture-handler';
  import * as Haptics from 'expo-haptics';
  import { Ionicons } from '@expo/vector-icons';

  const { width: screenWidth } = Dimensions.get('window');
  const IMAGE_SIZE = (screenWidth - 4) / 3; // 2px gaps between images

  // Generate mountain biking themed images
  const generateMTBImages = () => {
    const images = [];
    for (let i = 0; i < 50; i++) {
      images.push({
        id: i.toString(),
        uri: `https://picsum.photos/400/400?random=${i}`,
      });
    }
    return images;
  };

  const IMAGES_DATA = generateMTBImages();

  // Avatar data with placeholder images
  const AVATARS = [
    { id: '1', uri: 'https://i.pravatar.cc/150?img=11' },
    { id: '2', uri: 'https://i.pravatar.cc/150?img=12' },
    { id: '3', uri: 'https://i.pravatar.cc/150?img=13' },
  ];

  // Animated Hero Header Component V2
  const AnimatedHeroHeaderV2 = ({ scrollY, animationProgress }) => {

    // Hero container height - taller in scrolled state for gradient
    const heroStyle = useAnimatedStyle(() => {
      const height = interpolate(
        animationProgress.value,
        [0, 1],
        [150, 200], // Increased default height from 140 to 150 to prevent clipping
        Extrapolate.CLAMP
      );

      return { height };
    });

    // Background image fade out (unified animation)
    const backgroundStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        animationProgress.value,
        [0, 1],
        [1, 0],
        Extrapolate.CLAMP
      );

      return { opacity };
    });

    // Title text fade out (unified animation)
    const titleStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        animationProgress.value,
        [0, 1],
        [1, 0],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        // No translateY - hamburger menu stays in place
      };
    });

    // Avatar stack disappear (unified animation)
    const avatarsStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        animationProgress.value,
        [0, 1],
        [1, 0],
        Extrapolate.CLAMP
      );

      const translateX = interpolate(
        animationProgress.value,
        [0, 1],
        [0, 100],
        Extrapolate.CLAMP
      );

      return {
        opacity,
        transform: [{ translateX }],
      };
    });

    // Search bar slides right and up (unified animation)
    const searchBarStyle = useAnimatedStyle(() => {
      // Slide right to fill avatar space
      const translateX = interpolate(
        animationProgress.value,
        [0, 1],
        [0, 100], // Same distance as avatars slide out
        Extrapolate.CLAMP
      );

      // Slide up to align with hamburger menu
      const translateY = interpolate(
        animationProgress.value,
        [0, 1],
        [0, -68], // Increased movement to properly align with hamburger
        Extrapolate.CLAMP
      );

      return {
        transform: [{ translateX }, { translateY }],
      };
    });

    // Invite button slides up (unified animation)
    const inviteButtonStyle = useAnimatedStyle(() => {
      // Slide up to align with hamburger menu
      const translateY = interpolate(
        animationProgress.value,
        [0, 1],
        [0, -68], // Same distance as search bar to align with hamburger
        Extrapolate.CLAMP
      );

      return {
        opacity: 1, // Always visible
        transform: [{ translateY }],
      };
    });

    // Gradient overlay appears (unified animation)
    const gradientStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        animationProgress.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP
      );

      return { opacity };
    });

    return (
      <>
        <Animated.View style={[styles.heroContainer, heroStyle]}>
          {/* Background Image */}
          <Animated.Image
            source={{ uri: 'https://picsum.photos/800/400?random=hero' }}
            style={[styles.heroBackground, backgroundStyle]}
            resizeMode="cover"
          />

          {/* Content Container */}
          <View style={styles.heroContent}>
            {/* Top Row - Hamburger Menu (static) and Title Text (animated) */}
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                {/* Hamburger Menu - Never changes */}
                <Ionicons name="menu" size={24} color="#FFFFFF" style={styles.menuIcon} />
                {/* Title Text - Fades out */}
                <Animated.Text style={[styles.heroTitle, titleStyle]}>MTB Crew!</Animated.Text>
              </View>
            </View>

            {/* Middle Row - Search Bar and Avatars */}
            <View style={styles.middleRow}>
              {/* Search Bar */}
              <Animated.View style={[styles.searchBarContainer, searchBarStyle]}>
                <View style={styles.searchBar}>
                  <Ionicons name="hardware-chip" size={16} color="#007AFF" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="AI powered photo assistant..."
                    placeholderTextColor="#8E8E93"
                    editable={false}
                  />
                </View>
              </Animated.View>

              {/* Avatar Stack with Add Person Button */}
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
                {/* Add Person Button */}
                <TouchableOpacity
                  style={styles.addPersonButton}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Ionicons name="person-add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </Animated.View>

              {/* Invite Button (always visible, stays in place) */}
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

        {/* Fixed Gradient Overlay (appears when scrolled) */}
        <Animated.View style={[styles.gradientOverlay, gradientStyle]} pointerEvents="none">
          {/* Gradient layers - darker at top, transparent at bottom */}
          <View style={[styles.gradientLayer, { opacity: 0.8, backgroundColor: 'rgba(0, 0, 0, 0.8)' }]} />
          <View style={[styles.gradientLayer, { opacity: 0.6, top: 50, backgroundColor: 'rgba(0, 0, 0, 0.6)' }]} />
          <View style={[styles.gradientLayer, { opacity: 0.3, top: 100, backgroundColor: 'rgba(0, 0, 0, 0.3)' }]} />
          <View style={[styles.gradientLayer, { opacity: 0.1, top: 150, backgroundColor: 'rgba(0, 0, 0, 0.1)' }]} />
          <View style={[styles.gradientLayer, { opacity: 0.05, top: 200, backgroundColor: 'rgba(0, 0, 0, 0.05)' }]} />
        </Animated.View>

      </>
    );
  };

  // Main Component
  export default function HeroAnimationV2() {
    const scrollY = useSharedValue(0);
    const animationProgress = useSharedValue(0);
    const flatListRef = useRef(null);

    const scrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
        const currentY = event.contentOffset.y;

        // Simple bounds checking
        if (currentY >= 0 && currentY < 5000) {
          scrollY.value = currentY;

          // Simple position-based animation
          const maxScroll = 300; // Animation completes after 300px
          const newProgress = Math.min(1, Math.max(0, currentY / maxScroll));
          animationProgress.value = newProgress;

        }
      },
    });

    const handleScrollEndDrag = useCallback(() => {
      if (animationProgress.value > 0.8) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, [animationProgress]);

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
      <View style={{ height: 160 }} />
    ), []);

    const footerComponent = useMemo(() => (
      <View style={{ height: 100 }} />
    ), []);

    return (
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Animated Hero Header V2 */}
        <AnimatedHeroHeaderV2 scrollY={scrollY} animationProgress={animationProgress} />

        {/* Photo Grid */}
        <Animated.FlatList
          ref={flatListRef}
          data={IMAGES_DATA}
          renderItem={renderImage}
          keyExtractor={keyExtractor}
          numColumns={3}
          onScroll={scrollHandler}
          onScrollEndDrag={handleScrollEndDrag}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={headerComponent}
          ListFooterComponent={footerComponent}
          removeClippedSubviews={false}
          maxToRenderPerBatch={15}
          windowSize={10}
          initialNumToRender={15}
          contentContainerStyle={styles.gridContent}
          columnWrapperStyle={styles.row}
          inverted={false}
          bounces={true}
          bouncesZoom={false}
          contentInsetAdjustmentBehavior="never"
        />

      </GestureHandlerRootView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },

    // Hero Header Styles
    heroContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: '#535E70',
      overflow: 'hidden',
    },
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    heroContent: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 60 : 40,
      justifyContent: 'space-between',
      paddingBottom: 8, // Reduced to 8pt as requested
    },

    // Title Row
    titleRow: {
      marginBottom: 16,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuIcon: {
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

    // Middle Row - Search and Avatars
    middleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    // Search Bar
    searchBarContainer: {
      flex: 1,
    },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      paddingHorizontal: 16,
      height: 36,
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
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    addPersonButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8, // 8pt spacing after the last avatar
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
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#007AFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },

    // Fixed Gradient Overlay
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      zIndex: 8, // Between photo grid (1) and hero header (10)
    },
    gradientLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 50,
      // backgroundColor will be set inline for each layer
    },

    // Grid Styles
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