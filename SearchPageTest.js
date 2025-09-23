// Search Page Test with Three-Layer Architecture - Copy this file to snack.expo.dev
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Search suggestions and example data
const SEARCH_EXAMPLES = [
  "Show me photos of me mountain biking",
  "Find pictures from last summer",
  "Photos with my family at the beach",
  "All sunset photos from vacation",
  "Pictures of my dog playing",
  "Group photos from parties",
  "Nature photos with mountains",
  "Photos taken in December",
];

const RECENT_SEARCHES = [
  "mountain biking",
  "family vacation",
  "sunset photos",
  "birthday party",
  "hiking trip",
];

const TRENDING_SEARCHES = [
  "holiday photos",
  "outdoor adventures",
  "group photos",
  "travel memories",
  "nature shots",
];

// Pull Down Layer - Advanced Search Tools
const AdvancedSearchLayer = ({ isVisible }) => {
  const layerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      isVisible ? 1 : 0,
      [0, 1],
      [-200, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
      opacity: isVisible ? 1 : 0,
    };
  });

  return (
    <Animated.View style={[styles.pullDownLayer, layerStyle]}>
      <Text style={styles.layerTitle}>Advanced Search</Text>

      {/* Search Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filters</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { name: 'Date Range', icon: 'calendar' },
            { name: 'People', icon: 'people' },
            { name: 'Location', icon: 'location' },
            { name: 'Events', icon: 'star' },
            { name: 'Camera', icon: 'camera' },
          ].map(filter => (
            <TouchableOpacity key={filter.name} style={styles.filterButton}>
              <Ionicons name={filter.icon} size={18} color="#007AFF" />
              <Text style={styles.filterText}>{filter.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Searches */}
      <View style={styles.recentSection}>
        <Text style={styles.filterTitle}>Recent Searches</Text>
        {RECENT_SEARCHES.map(search => (
          <TouchableOpacity key={search} style={styles.recentItem}>
            <Ionicons name="time" size={16} color="#8E8E93" />
            <Text style={styles.recentText}>{search}</Text>
            <Ionicons name="arrow-up-left" size={14} color="#8E8E93" />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

// Main Search Interface (Default View)
const SearchInterface = ({ searchText, setSearchText, onFocus }) => {
  const [currentExample, setCurrentExample] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentExample(prev => (prev + 1) % SEARCH_EXAMPLES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.searchSection}>
      {/* Main Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your photos with AI..."
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
            onFocus={onFocus}
            returnKeyType="search"
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Rotating Example Prompt */}
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleLabel}>Try searching:</Text>
        <Text style={styles.exampleText}>"{SEARCH_EXAMPLES[currentExample]}"</Text>
      </View>

      {/* Quick Search Suggestions */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Quick Searches</Text>
        <View style={styles.suggestionButtons}>
          {['People', 'Places', 'Things', 'Events', 'Dates', 'Colors'].map(suggestion => (
            <TouchableOpacity
              key={suggestion}
              style={styles.suggestionButton}
              onPress={() => setSearchText(suggestion.toLowerCase())}
            >
              <Text style={styles.suggestionButtonText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Gesture Hint */}
      <View style={styles.gestureHintContainer}>
        <View style={styles.gestureHint}>
          <Ionicons name="chevron-up" size={16} color="#8E8E93" />
          <Text style={styles.gestureHintText}>Pull up for smart discovery</Text>
        </View>
        <View style={[styles.gestureHint, { marginTop: 8 }]}>
          <Ionicons name="chevron-down" size={16} color="#8E8E93" />
          <Text style={styles.gestureHintText}>Pull down for advanced tools</Text>
        </View>
      </View>
    </View>
  );
};

// Pull Up Layer - Smart Discovery
const SmartDiscoveryLayer = ({ isVisible }) => {
  const layerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      isVisible ? 1 : 0,
      [0, 1],
      [screenHeight, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[styles.pullUpLayer, layerStyle]}>
      <View style={styles.layerHandle} />
      <Text style={styles.layerTitle}>Smart Discovery</Text>

      {/* Smart Collections */}
      <View style={styles.discoverySectionContainer}>
        <Text style={styles.discoveryTitle}>Auto-Curated Collections</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { name: 'Recent Trips', count: 143, icon: 'airplane', color: '#34C759' },
            { name: 'Family Time', count: 89, icon: 'people', color: '#007AFF' },
            { name: 'Adventures', count: 67, icon: 'mountain', color: '#FF9500' },
            { name: 'Food & Dining', count: 156, icon: 'restaurant', color: '#FF3B30' },
            { name: 'Nature', count: 234, icon: 'leaf', color: '#30B0C7' },
          ].map(collection => (
            <TouchableOpacity key={collection.name} style={styles.collectionCard}>
              <View style={[styles.collectionIcon, { backgroundColor: collection.color + '20' }]}>
                <Ionicons name={collection.icon} size={24} color={collection.color} />
              </View>
              <Text style={styles.collectionName}>{collection.name}</Text>
              <Text style={styles.collectionCount}>{collection.count} photos</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Trending Searches */}
      <View style={styles.discoverySectionContainer}>
        <Text style={styles.discoveryTitle}>Trending Now</Text>
        <View style={styles.trendingContainer}>
          {TRENDING_SEARCHES.map((search, index) => (
            <TouchableOpacity key={search} style={styles.trendingItem}>
              <View style={styles.trendingRank}>
                <Text style={styles.trendingRankText}>{index + 1}</Text>
              </View>
              <Text style={styles.trendingText}>{search}</Text>
              <Ionicons name="trending-up" size={16} color="#34C759" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* AI Suggestions */}
      <View style={styles.discoverySectionContainer}>
        <Text style={styles.discoveryTitle}>AI Recommendations</Text>
        <View style={styles.aiSuggestions}>
          {[
            "Create an album from your mountain biking photos",
            "Your sunset photos would make a beautiful collection",
            "Want to search for photos from your last trip?",
          ].map(suggestion => (
            <TouchableOpacity key={suggestion} style={styles.aiSuggestionCard}>
              <Ionicons name="sparkles" size={20} color="#FF9500" style={styles.aiIcon} />
              <Text style={styles.aiSuggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

// Main Search Page Component with Three-Layer Architecture
export default function SearchPageTest() {
  const [searchText, setSearchText] = useState('');
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [showSmartDiscovery, setShowSmartDiscovery] = useState(false);

  const translateY = useSharedValue(0);
  const panRef = useRef(null);

  const panGestureHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      translateY.value = offsetY;

      // Pull down threshold for advanced tools
      if (offsetY < -100) {
        runOnJS(setShowAdvancedTools)(true);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      } else if (offsetY > -50) {
        runOnJS(setShowAdvancedTools)(false);
      }

      // Pull up threshold for smart discovery
      if (offsetY > 100) {
        runOnJS(setShowSmartDiscovery)(true);
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      } else if (offsetY < 50) {
        runOnJS(setShowSmartDiscovery)(false);
      }
    },
  });

  const handleSearchFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAdvancedTools(false);
    setShowSmartDiscovery(false);
  };

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      Math.abs(translateY.value),
      [0, 100],
      [0, 0.3],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Overlay for layer transitions */}
      <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none" />

      {/* Pull Down Layer - Advanced Search Tools */}
      <AdvancedSearchLayer isVisible={showAdvancedTools} />

      {/* Main Content with Gesture Handler */}
      <Animated.ScrollView
        ref={panRef}
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={panGestureHandler}
        scrollEventThrottle={16}
        bounces={true}
        bouncesZoom={false}
      >
        {/* Default View - Search Interface */}
        <SearchInterface
          searchText={searchText}
          setSearchText={setSearchText}
          onFocus={handleSearchFocus}
        />
      </Animated.ScrollView>

      {/* Pull Up Layer - Smart Discovery */}
      <SmartDiscoveryLayer isVisible={showSmartDiscovery} />

      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>🔍 Search Page</Text>
        <Text style={styles.debugText}>↑ Pull up: Smart Discovery</Text>
        <Text style={styles.debugText}>↓ Pull down: Advanced Tools</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    minHeight: screenHeight,
  },

  // Pull Down Layer Styles
  pullDownLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248, 248, 248, 0.95)',
    backdropFilter: 'blur(10px)',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  layerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  recentSection: {
    marginBottom: 20,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recentText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    marginLeft: 12,
  },

  // Pull Up Layer Styles
  pullUpLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248, 248, 248, 0.95)',
    backdropFilter: 'blur(10px)',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 20,
    zIndex: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
  },
  layerHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  discoverySectionContainer: {
    marginBottom: 24,
  },
  discoveryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  collectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 120,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  collectionName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  collectionCount: {
    fontSize: 11,
    color: '#8E8E93',
  },
  trendingContainer: {
    gap: 8,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  trendingRank: {
    width: 24,
    height: 24,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trendingRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trendingText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  aiSuggestions: {
    gap: 8,
  },
  aiSuggestionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
  },
  aiIcon: {
    marginRight: 12,
    marginTop: 1,
  },
  aiSuggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },

  // Main Search Section Styles
  searchSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  searchBarContainer: {
    marginBottom: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    marginLeft: 8,
  },
  exampleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  exampleLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 16,
    color: '#007AFF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  suggestionsContainer: {
    marginBottom: 30,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  suggestionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  suggestionButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  gestureHintContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  gestureHint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    borderRadius: 16,
  },
  gestureHintText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 6,
    fontWeight: '500',
  },

  // Debug Info
  debugInfo: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 100,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});