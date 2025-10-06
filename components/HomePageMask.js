// HomePageMask.js - Full-screen home page with circular mask reveal animation
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Dummy activity feed data
const ACTIVITY_FEED = [
  {
    id: '1',
    type: 'upload',
    user: 'John',
    action: 'uploaded 4 photos to',
    target: 'MTB Crew!',
    time: '2 minutes ago',
    icon: 'images',
    iconColor: '#1C47CB',
  },
  {
    id: '2',
    type: 'join_bucket',
    user: 'Sally',
    action: 'joined',
    target: 'MTB Crew',
    time: '15 minutes ago',
    icon: 'person-add',
    iconColor: '#02E39F',
  },
  {
    id: '3',
    type: 'upload',
    user: 'Mike',
    action: 'uploaded 12 photos to',
    target: 'Weekend Rides',
    time: '1 hour ago',
    icon: 'images',
    iconColor: '#1C47CB',
  },
  {
    id: '4',
    type: 'join_bucket',
    user: 'Tim',
    action: 'joined',
    target: 'Summer Vacation 2024',
    time: '2 hours ago',
    icon: 'person-add',
    iconColor: '#02E39F',
  },
  {
    id: '5',
    type: 'comment',
    user: 'Sarah',
    action: 'commented on your photo in',
    target: 'Trail Adventures',
    time: '3 hours ago',
    icon: 'chatbubble',
    iconColor: '#FF6B6B',
  },
  {
    id: '6',
    type: 'upload',
    user: 'Alex',
    action: 'uploaded 7 photos to',
    target: 'Family Reunion',
    time: '5 hours ago',
    icon: 'images',
    iconColor: '#1C47CB',
  },
  {
    id: '7',
    type: 'create',
    user: 'Emma',
    action: 'created a new bucket',
    target: 'Hiking 2025',
    time: '6 hours ago',
    icon: 'add-circle',
    iconColor: '#FFA500',
  },
  {
    id: '8',
    type: 'join_bucket',
    user: 'David',
    action: 'joined',
    target: 'Photography Club',
    time: '8 hours ago',
    icon: 'person-add',
    iconColor: '#02E39F',
  },
  {
    id: '9',
    type: 'upload',
    user: 'Lisa',
    action: 'uploaded 15 photos to',
    target: 'Birthday Party',
    time: 'Yesterday',
    icon: 'images',
    iconColor: '#1C47CB',
  },
  {
    id: '10',
    type: 'share',
    user: 'Ryan',
    action: 'shared a memory from',
    target: 'Christmas 2023',
    time: 'Yesterday',
    icon: 'share-social',
    iconColor: '#9B59B6',
  },
];

const HomePageMask = ({ isVisible, onClose, animationConfig, buttonPosition }) => {
  const circleRadius = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  // Calculate center point of home button (dynamic or default to bottom-left)
  const buttonCenterX = buttonPosition?.x || 56; // Default to BottomNavAlt position
  const buttonCenterY = buttonPosition?.y || (screenHeight - (Platform.OS === 'ios' ? 70 : 56));

  // Calculate maximum radius needed to cover entire screen
  const calculateMaxRadius = () => {
    const distances = [
      Math.hypot(buttonCenterX, buttonCenterY), // To top-left
      Math.hypot(screenWidth - buttonCenterX, buttonCenterY), // To top-right
      Math.hypot(buttonCenterX, screenHeight - buttonCenterY), // To bottom-left
      Math.hypot(screenWidth - buttonCenterX, screenHeight - buttonCenterY), // To bottom-right
    ];
    return Math.max(...distances);
  };

  const maxRadius = calculateMaxRadius();

  useEffect(() => {
    if (isVisible) {
      // Animate in - circular reveal
      // Easing.inOut(Easing.quad) = even slower start/end with gentler curve
      circleRadius.value = withTiming(maxRadius, {
        duration: 850, // Longer duration for more pronounced slow phases
        easing: Easing.inOut(Easing.quad),
      });
      // Fade in backdrop synchronized with circle growth
      backdropOpacity.value = withTiming(0.5, {
        duration: 850,
        easing: Easing.inOut(Easing.quad),
      });
    } else {
      // Animate out - reverse circular reveal with same timing as growth
      circleRadius.value = withTiming(0, {
        duration: 850, // Same duration as opening
        easing: Easing.inOut(Easing.quad), // Same easing as opening
      });
      backdropOpacity.value = withTiming(0, {
        duration: 850, // Same duration as opening
        easing: Easing.inOut(Easing.quad), // Same easing as opening
      });
    }
  }, [isVisible, maxRadius, circleRadius, backdropOpacity]);

  // Backdrop animation
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    pointerEvents: isVisible ? 'auto' : 'none',
  }));

  // Animated styles for the mask circle
  const maskCircleStyle = useAnimatedStyle(() => ({
    width: circleRadius.value * 2,
    height: circleRadius.value * 2,
    borderRadius: circleRadius.value,
    left: buttonCenterX - circleRadius.value,
    top: buttonCenterY - circleRadius.value,
  }));

  // Container visibility
  const containerStyle = useAnimatedStyle(() => ({
    opacity: circleRadius.value > 0 ? 1 : 0,
    pointerEvents: isVisible ? 'auto' : 'none',
  }));


  const ActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: `${item.iconColor}15` }]}>
        <Ionicons name={item.icon} size={20} color={item.iconColor} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          <Text style={styles.activityUser}>{item.user}</Text>
          {' '}{item.action}{' '}
          <Text style={styles.activityTarget}>{item.target}</Text>
        </Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
    </View>
  );

  if (!isVisible && circleRadius.value === 0) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      {/* Main Page with Circular Mask Reveal */}
      <Animated.View style={[styles.container, containerStyle]}>
        <MaskedView
          style={StyleSheet.absoluteFillObject}
          maskElement={
            <View style={StyleSheet.absoluteFillObject}>
              <Animated.View style={[styles.maskCircle, maskCircleStyle]} />
            </View>
          }
        >
          {/* Page Content - Static, full size */}
          <View style={styles.pageContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.welcomeText}>Welcome back, Mike</Text>
            </View>

            {/* Activity Feed */}
            <ScrollView
              style={styles.feedContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.feedContent}
            >
              <Text style={styles.sectionTitle}>Activity from all your Buckets</Text>
              {ACTIVITY_FEED.map((item) => (
                <ActivityItem key={item.id} item={item} />
              ))}
            </ScrollView>

            {/* Bottom Container for Close Button */}
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onClose();
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </MaskedView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    zIndex: 998,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  maskCircle: {
    position: 'absolute',
    backgroundColor: 'white',
  },
  pageContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  welcomeText: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '400',
    textAlign: 'center',
  },
  feedContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  feedContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#000000',
    marginBottom: 4,
  },
  activityUser: {
    fontWeight: '600',
  },
  activityTarget: {
    fontWeight: '600',
    color: '#1C47CB',
  },
  activityTime: {
    fontSize: 13,
    color: '#8E8E93',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default HomePageMask;