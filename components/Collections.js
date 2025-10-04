// Collections.js - Collections Page Component
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width: screenWidth } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARDS_PER_ROW = 2;
const CARD_WIDTH = (screenWidth - 40 - (CARD_MARGIN * 2 * CARDS_PER_ROW)) / CARDS_PER_ROW;

// Dummy data for albums with mosaic layout
const ALBUMS = [
  { id: '1', name: 'Summer 2024', count: 234, photos: ['🏖️', '🌅', '🏄', '☀️'] },
  { id: '2', name: 'MTB Adventures', count: 567, photos: ['🚵', '⛰️', '🌲', '🚴'] },
  { id: '3', name: 'Family Moments', count: 890, photos: ['👨‍👩‍👧‍👦', '🎂', '🎄', '🏠'] },
  { id: '4', name: 'City Life', count: 123, photos: ['🏙️', '🌃', '🚇', '🏛️'] },
];

// Smart albums with special indicators
const SMART_ALBUMS = [
  { id: '1', name: 'Favorites', count: 45, icon: 'heart', color: '#FF3B30' },
  { id: '2', name: 'Recently Added', count: 89, icon: 'time-outline', color: '#007AFF' },
  { id: '3', name: 'Videos', count: 23, icon: 'videocam', color: '#34C759' },
  { id: '4', name: 'Selfies', count: 67, icon: 'camera-reverse', color: '#FF9500' },
  { id: '5', name: 'Screenshots', count: 156, icon: 'phone-portrait', color: '#5856D6' },
  { id: '6', name: 'Panoramas', count: 12, icon: 'panorama', color: '#00C7BE' },
];

// Faces data
const FACES = [
  { id: '1', name: 'Mike', count: 234, avatar: '👨' },
  { id: '2', name: 'Sarah', count: 189, avatar: '👩' },
  { id: '3', name: 'Emma', count: 156, avatar: '👧' },
  { id: '4', name: 'James', count: 145, avatar: '👦' },
  { id: '5', name: 'Mom', count: 201, avatar: '👩‍🦳' },
  { id: '6', name: 'Dad', count: 178, avatar: '👨‍🦳' },
];

// Events data
const EVENTS = [
  { id: '1', name: 'Whistler Trip', date: 'Aug 15-20', count: 345, gradient: ['#667eea', '#764ba2'] },
  { id: '2', name: 'Emma\'s Birthday', date: 'Jul 12', count: 89, gradient: ['#f093fb', '#f5576c'] },
  { id: '3', name: 'Summer BBQ', date: 'Jun 30', count: 67, gradient: ['#4facfe', '#00f2fe'] },
  { id: '4', name: 'Graduation Day', date: 'May 15', count: 123, gradient: ['#43e97b', '#38f9d7'] },
];

const Collections = ({ isVisible }) => {
  if (!isVisible) return null;

  const handlePress = (type, item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(`Pressed ${type}:`, item);
  };

  // Album card with mosaic of 4 photos
  const AlbumCard = ({ album }) => (
    <TouchableOpacity
      style={styles.albumCard}
      onPress={() => handlePress('album', album)}
      activeOpacity={0.7}
    >
      <View style={styles.albumMosaic}>
        {album.photos.map((photo, index) => (
          <View key={index} style={[
            styles.mosaicTile,
            index === 0 && styles.topLeft,
            index === 1 && styles.topRight,
            index === 2 && styles.bottomLeft,
            index === 3 && styles.bottomRight,
          ]}>
            <Text style={styles.mosaicEmoji}>{photo}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.albumName}>{album.name}</Text>
      <Text style={styles.albumCount}>{album.count} Photos</Text>
    </TouchableOpacity>
  );

  // Smart album card with icon and gradient
  const SmartAlbumCard = ({ album }) => (
    <TouchableOpacity
      style={styles.smartAlbumCard}
      onPress={() => handlePress('smart-album', album)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f8f8']}
        style={styles.smartAlbumGradient}
      >
        <View style={[styles.smartAlbumIcon, { backgroundColor: `${album.color}15` }]}>
          <Ionicons name={album.icon} size={24} color={album.color} />
        </View>
        <View style={styles.smartAlbumInfo}>
          <Text style={styles.smartAlbumName}>{album.name}</Text>
          <Text style={styles.smartAlbumCount}>{album.count}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Face avatar
  const FaceAvatar = ({ face }) => (
    <TouchableOpacity
      style={styles.faceContainer}
      onPress={() => handlePress('face', face)}
      activeOpacity={0.7}
    >
      <View style={styles.faceAvatar}>
        <Text style={styles.faceEmoji}>{face.avatar}</Text>
      </View>
      <Text style={styles.faceName}>{face.name}</Text>
      <Text style={styles.faceCount}>{face.count}</Text>
    </TouchableOpacity>
  );

  // Event card with gradient background
  const EventCard = ({ event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handlePress('event', event)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={event.gradient}
        style={styles.eventGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.eventOverlay}>
          <Text style={styles.eventDate}>{event.date}</Text>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventCount}>{event.count} Photos</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Collections</Text>

        {/* Albums Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Albums</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.albumsGrid}>
            {ALBUMS.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </View>
        </View>

        {/* Smart Albums Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Smart Albums</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.smartAlbumsGrid}>
            {SMART_ALBUMS.map((album) => (
              <SmartAlbumCard key={album.id} album={album} />
            ))}
          </View>
        </View>

        {/* Faces Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>People</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.facesScroll}
          >
            {FACES.map((face) => (
              <FaceAvatar key={face.id} face={face} />
            ))}
          </ScrollView>
        </View>

        {/* Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsScroll}
          >
            {EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F2F2F7',
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 178,
    paddingBottom: 110,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  seeAll: {
    fontSize: 15,
    color: '#1C47CB',
  },
  // Albums styles
  albumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20 - CARD_MARGIN,
  },
  albumCard: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    marginBottom: 16,
  },
  albumMosaic: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mosaicTile: {
    width: '50%',
    height: '50%',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#FFFFFF',
  },
  topLeft: {
    borderTopLeftRadius: 12,
  },
  topRight: {
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    borderBottomRightRadius: 12,
  },
  mosaicEmoji: {
    fontSize: 32,
  },
  albumName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    marginTop: 8,
  },
  albumCount: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  // Smart Albums styles
  smartAlbumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20 - CARD_MARGIN,
  },
  smartAlbumCard: {
    width: CARD_WIDTH,
    margin: CARD_MARGIN,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  smartAlbumGradient: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smartAlbumIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  smartAlbumInfo: {
    flex: 1,
  },
  smartAlbumName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  smartAlbumCount: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  // Faces styles
  facesScroll: {
    paddingHorizontal: 20,
  },
  faceContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  faceAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  faceEmoji: {
    fontSize: 36,
  },
  faceName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
    marginTop: 6,
  },
  faceCount: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 1,
  },
  // Events styles
  eventsScroll: {
    paddingHorizontal: 20,
  },
  eventCard: {
    width: 180,
    height: 120,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  eventGradient: {
    flex: 1,
    padding: 16,
  },
  eventOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  eventDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 2,
  },
  eventCount: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
});

export default Collections;