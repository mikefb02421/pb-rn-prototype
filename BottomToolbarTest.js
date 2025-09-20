// Bottom Toolbar Test - Copy this file to snack.expo.dev
import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width: screenWidth } = Dimensions.get('window');
const IMAGE_SIZE = (screenWidth - 4) / 3; // 2px gaps between images

// Simple image data for testing
const generateImages = () => {
  const images = [];
  for (let i = 0; i < 60; i++) {
    images.push({
      id: i.toString(),
      uri: `https://picsum.photos/400/400?random=${i}`,
    });
  }
  return images;
};

const IMAGES_DATA = generateImages();

// Bottom Toolbar Component with Layered Blur Effects
const BottomToolbar = ({ onAddPress }) => {
  const [activeTab, setActiveTab] = useState('gallery');

  const handleTabPress = (tab) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  return (
    <Animated.View style={styles.toolbarContainer}>
      {/* Multiple blur layers to create gradient effect */}
      <BlurView intensity={25} tint="light" style={styles.toolbarBackgroundBlurBottom} />
      <BlurView intensity={15} tint="light" style={styles.toolbarBackgroundBlurMiddle} />
      <BlurView intensity={5} tint="light" style={styles.toolbarBackgroundBlurTop} />

      {/* White pill on top */}
      <View style={styles.toolbarPill}>
        <View style={styles.toolbarContent}>
          <TouchableOpacity
            onPress={() => handleTabPress('home')}
            style={styles.toolbarItem}
          >
            <Ionicons
              name="home"
              size={24}
              color={activeTab === 'home' ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('gallery')}
            style={styles.toolbarItem}
          >
            <Ionicons
              name="images"
              size={24}
              color={activeTab === 'gallery' ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onAddPress && onAddPress();
            }}
            style={styles.addButton}
          >
            <Ionicons name="add" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('search')}
            style={styles.toolbarItem}
          >
            <Ionicons
              name="search"
              size={24}
              color={activeTab === 'search' ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabPress('people')}
            style={styles.toolbarItem}
          >
            <Ionicons
              name="people"
              size={24}
              color={activeTab === 'people' ? '#007AFF' : '#8E8E93'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Main Test Component
export default function BottomToolbarTest() {
  const scrollY = useSharedValue(0);
  const flatListRef = useRef(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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

  const footerComponent = useMemo(() => (
    <View style={{ height: 120 }} />
  ), []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Animated.FlatList
        ref={flatListRef}
        data={IMAGES_DATA}
        renderItem={renderImage}
        keyExtractor={keyExtractor}
        numColumns={3}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={footerComponent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={12}
        windowSize={5}
        initialNumToRender={12}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.row}
        inverted={true}
        contentInsetAdjustmentBehavior="never"
      />

      <BottomToolbar onAddPress={() => console.log('Add pressed')} />

      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Bottom Toolbar Test</Text>
        <Text style={styles.debugText}>Layered blur effects</Text>
        <Text style={styles.debugText}>Images scroll behind</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  debugInfo: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 100,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
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
  toolbarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  toolbarBackgroundBlurBottom: {
    position: 'absolute',
    top: 20,
    left: -20,
    right: -20,
    bottom: -20,
  },
  toolbarBackgroundBlurMiddle: {
    position: 'absolute',
    top: -10,
    left: -20,
    right: -20,
    bottom: 10,
  },
  toolbarBackgroundBlurTop: {
    position: 'absolute',
    top: -30,
    left: -20,
    right: -20,
    bottom: 30,
  },
  toolbarPill: {
    width: screenWidth - 32,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  toolbarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  toolbarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});