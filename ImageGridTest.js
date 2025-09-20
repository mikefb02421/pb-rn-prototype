// Image Grid Test - Copy this file to snack.expo.dev
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
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');

// Image data generators
const generateImages = (count = 60, seed = '') => {
  const images = [];
  for (let i = 0; i < count; i++) {
    images.push({
      id: i.toString(),
      uri: `https://picsum.photos/400/400?random=${seed}${i}`,
    });
  }
  return images;
};

const generateMountainBikingImages = (count = 60) => {
  const themes = [
    'mountain-biking-trail',
    'mountain-bike-sunset',
    'mountain-biking-forest',
    'mountain-bike-jump',
    'cycling-mountains',
    'bike-trail-nature',
  ];

  const images = [];
  for (let i = 0; i < count; i++) {
    images.push({
      id: i.toString(),
      uri: `https://source.unsplash.com/400x400/?${themes[i % themes.length]}&sig=${i}`,
    });
  }
  return images;
};

// Configurable Image Grid Component
const ImageGrid = ({
  data,
  numColumns = 3,
  imageGap = 2,
  inverted = false,
  onImagePress,
  headerHeight = 0,
  footerHeight = 0,
}) => {
  const flatListRef = useRef(null);
  const scrollY = useSharedValue(0);

  // Calculate image size based on columns and gaps
  const imageSize = (screenWidth - (imageGap * (numColumns + 1))) / numColumns;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderImage = useCallback(({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onImagePress && onImagePress(item, index);
        }}
        style={[
          styles.imageContainer,
          {
            width: imageSize,
            height: imageSize,
            marginLeft: (index % numColumns === 0) ? imageGap : imageGap / 2,
            marginRight: (index % numColumns === numColumns - 1) ? imageGap : imageGap / 2,
            marginBottom: imageGap,
          },
        ]}
      >
        <Image
          source={{ uri: item.uri }}
          style={[styles.gridImage, { width: imageSize, height: imageSize }]}
          defaultSource={{ uri: 'https://via.placeholder.com/400x400/F2F2F7/8E8E93?text=Loading' }}
        />
      </TouchableOpacity>
    );
  }, [imageSize, numColumns, imageGap, onImagePress]);

  const keyExtractor = useCallback((item) => item.id, []);

  const headerComponent = useMemo(() => (
    headerHeight > 0 ? <View style={{ height: headerHeight }} /> : null
  ), [headerHeight]);

  const footerComponent = useMemo(() => (
    footerHeight > 0 ? <View style={{ height: footerHeight }} /> : null
  ), [footerHeight]);

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={data}
      renderItem={renderImage}
      keyExtractor={keyExtractor}
      numColumns={numColumns}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
      removeClippedSubviews={true}
      maxToRenderPerBatch={numColumns * 4}
      windowSize={5}
      initialNumToRender={numColumns * 6}
      contentContainerStyle={[styles.gridContent, { paddingHorizontal: imageGap }]}
      inverted={inverted}
      contentInsetAdjustmentBehavior="never"
      getItemLayout={(data, index) => ({
        length: imageSize + imageGap,
        offset: (imageSize + imageGap) * Math.floor(index / numColumns),
        index,
      })}
    />
  );
};

// Main Test Component
export default function ImageGridTest() {
  const [config, setConfig] = useState({
    columns: 3,
    gap: 2,
    inverted: true,
    imageSource: 'picsum', // 'picsum' or 'unsplash'
    count: 60,
  });

  const imageData = useMemo(() => {
    if (config.imageSource === 'unsplash') {
      return generateMountainBikingImages(config.count);
    }
    return generateImages(config.count, config.imageSource);
  }, [config.imageSource, config.count]);

  const handleImagePress = (item, index) => {
    console.log('Image pressed:', item.id, 'at index:', index);
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ImageGrid
        data={imageData}
        numColumns={config.columns}
        imageGap={config.gap}
        inverted={config.inverted}
        onImagePress={handleImagePress}
        headerHeight={config.inverted ? 0 : 60}
        footerHeight={120}
      />

      {/* Configuration Controls */}
      <View style={styles.controlPanel}>
        <Text style={styles.controlTitle}>Grid Configuration</Text>

        {/* Columns */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Columns:</Text>
          {[2, 3, 4].map(cols => (
            <TouchableOpacity
              key={cols}
              style={[
                styles.controlButton,
                config.columns === cols && styles.controlButtonActive
              ]}
              onPress={() => updateConfig('columns', cols)}
            >
              <Text style={[
                styles.controlButtonText,
                config.columns === cols && styles.controlButtonTextActive
              ]}>
                {cols}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Gap */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Gap:</Text>
          {[1, 2, 4].map(gap => (
            <TouchableOpacity
              key={gap}
              style={[
                styles.controlButton,
                config.gap === gap && styles.controlButtonActive
              ]}
              onPress={() => updateConfig('gap', gap)}
            >
              <Text style={[
                styles.controlButtonText,
                config.gap === gap && styles.controlButtonTextActive
              ]}>
                {gap}px
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Inverted */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Mode:</Text>
          <TouchableOpacity
            style={[
              styles.controlButton,
              styles.controlButtonWide,
              config.inverted && styles.controlButtonActive
            ]}
            onPress={() => updateConfig('inverted', !config.inverted)}
          >
            <Text style={[
              styles.controlButtonText,
              config.inverted && styles.controlButtonTextActive
            ]}>
              {config.inverted ? 'Inverted' : 'Normal'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Image Source */}
        <View style={styles.controlRow}>
          <Text style={styles.controlLabel}>Source:</Text>
          {['picsum', 'unsplash'].map(source => (
            <TouchableOpacity
              key={source}
              style={[
                styles.controlButton,
                styles.controlButtonWide,
                config.imageSource === source && styles.controlButtonActive
              ]}
              onPress={() => updateConfig('imageSource', source)}
            >
              <Text style={[
                styles.controlButtonText,
                config.imageSource === source && styles.controlButtonTextActive
              ]}>
                {source}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  gridContent: {
    paddingVertical: 4,
  },
  imageContainer: {
    borderRadius: 0,
    overflow: 'hidden',
  },
  gridImage: {
    backgroundColor: '#F2F2F7',
  },
  controlPanel: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    zIndex: 100,
  },
  controlTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    minWidth: 60,
    marginRight: 8,
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  controlButtonWide: {
    paddingHorizontal: 16,
  },
  controlButtonActive: {
    backgroundColor: '#007AFF',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  controlButtonTextActive: {
    color: '#FFFFFF',
  },
});