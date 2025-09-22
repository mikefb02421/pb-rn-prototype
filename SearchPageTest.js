// Search Page Test with Continuous Scroll & Snap - Copy this file to snack.expo.dev
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheseeet,
  Dimensions,
  StatusBar,
  Platform,
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
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


// Search Interface Section
const SearchInterface = ({ searchText, setSearchText, onFocus }) => {
  const [currentExample, setCurrentExample] = useState(0);

  // Rotate through examples every 3 seconds
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

      {/* Scroll Hint */}
      <View style={styles.scrollHintContainer}>
        <View style={styles.scrollHint}>
          <Ionicons name="chevron-down" size={20} color="#8E8E93" />
          <Text style={styles.scrollHintText}>Scroll down for smart collections</Text>
          <Ionicons name="chevron-down" size={20} color="#8E8E93" />
        </View>
      </View>
    </View>
  );
};

// Smart Discovery Section
const SmartDiscoverySection = () => {
  return (
    <View style={styles.discoverySection}>
      {/* Smart Collections */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Smart Collections</Text>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScrollContainer}
        >
          {[
            { name: 'Recent Trips', count: 143, icon: 'airplane' },
            { name: 'Family Time', count: 89, icon: 'people' },
            { name: 'Adventures', count: 67, icon: 'mountain' },
            { name: 'Food & Dining', count: 156, icon: 'restaurant' },
            { name: 'Celebrations', count: 78, icon: 'gift' },
            { name: 'Nature', count: 234, icon: 'leaf' },
          ].map(collection => (
            <TouchableOpacity key={collection.name} style={styles.collectionCard}>
              <View style={styles.collectionIcon}>
                <Ionicons name={collection.icon} size={24} color="#007AFF" />
              </View>
              <Text style={styles.collectionName}>{collection.name}</Text>
              <Text style={styles.collectionCount}>{collection.count} photos</Text>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </View>

      {/* Trending Searches */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Trending Searches</Text>
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
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>AI Suggestions</Text>
        <View style={styles.aiSuggestions}>
          {[
            "Photos from your last vacation look amazing! Want to create an album?",
            "I noticed you have many outdoor photos. Search 'nature adventures'?",
            "Your holiday photos would make a great slideshow collection.",
            "Create a timeline of your summer adventures?",
            "Your pet photos would make an adorable collection!",
          ].map(suggestion => (
            <TouchableOpacity key={suggestion} style={styles.aiSuggestionCard}>
              <Ionicons name="sparkles" size={20} color="#FF9500" style={styles.aiIcon} />
              <Text style={styles.aiSuggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

// Main Search Page Component
export default function SearchPageTest() {
  const [searchText, setSearchText] = useState('');
  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef(null);

  // Define snap points
  const SEARCH_SNAP_POINT = 0;
  const DISCOVERY_SNAP_POINT = screenHeight * 0.7; // 70% of screen height
  const SNAP_THRESHOLD = 50; // How far to drag before snapping to next section

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      const offsetY = event.contentOffset.y;

      // Determine which snap point to go to based on current position
      if (offsetY < DISCOVERY_SNAP_POINT / 2) {
        // Closer to search section - snap to search
        runOnJS(snapToSection)(SEARCH_SNAP_POINT);
      } else {
        // Closer to discovery section - snap to discovery
        runOnJS(snapToSection)(DISCOVERY_SNAP_POINT);
      }
    },
  });

  const snapToSection = (offsetY) => {
    scrollViewRef.current?.scrollTo({
      y: offsetY,
      animated: true,
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSearchFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Ensure we're at the search section when focusing
    snapToSection(SEARCH_SNAP_POINT);
  };

  // Animated styles for scroll-based effects
  const searchSectionStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, DISCOVERY_SNAP_POINT / 2],
      [1, 0.3],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  const discoverySectionStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [DISCOVERY_SNAP_POINT / 2, DISCOVERY_SNAP_POINT],
      [0.5, 1],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={DISCOVERY_SNAP_POINT}
        snapToAlignment="start"
      >
        {/* Search Interface Section */}
        <Animated.View style={[styles.fullScreenSection, searchSectionStyle]}>
          <SearchInterface
            searchText={searchText}
            setSearchText={setSearchText}
            onFocus={handleSearchFocus}
          />
        </Animated.View>

        {/* Smart Discovery Section */}
        <Animated.View style={[styles.fullScreenSection, discoverySectionStyle]}>
          <SmartDiscoverySection />
        </Animated.View>
      </Animated.ScrollView>

      {/* Debug Info */}
      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Search Page - Continuous Scroll</Text>
        <Text style={styles.debugText}>Scroll down for collections</Text>
        <Text style={styles.debugText}>Magnetic snap behavior</Text>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  fullScreenSection: {
    minHeight: screenHeight,
    paddingHorizontal: 20,
  },

  // Search Section Styles
  searchSection: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 100,
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
  scrollHintContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  scrollHint: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    borderRadius: 20,
  },
  scrollHintText: {
    fontSize: 14,
    color: '#8E8E93',
    marginHorizontal: 8,
    fontWeight: '500',
  },

  // Discovery Section Styles
  discoverySection: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  horizontalScrollContainer: {
    paddingRight: 20,
    gap: 16,
  },
  collectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
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
    gap: 12,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    padding: 12,
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
    gap: 12,
  },
  aiSuggestionCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
  },
  aiIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  aiSuggestionText: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },

  // Debug Info
  debugInfo: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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