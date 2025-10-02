// BucketSettings.js - Bucket Settings Page Component
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Switch,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const BucketSettings = ({ isVisible, isRightHanded, onHandednessChange }) => {
  const [bucketName, setBucketName] = useState('MTB Crew!');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  const handlePress = (action) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Placeholder for button actions
    console.log('Pressed:', action);
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Bucket Settings</Text>

        {/* Bucket Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bucket Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={bucketName}
              onChangeText={setBucketName}
              placeholder="Enter bucket name"
            />
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="pencil" size={18} color="#1C47CB" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => handlePress('save-name')}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Save Bucket Name</Text>
          </TouchableOpacity>
        </View>

        {/* Integrations Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Integrations</Text>

          <View style={styles.cardGroup}>
            {/* WhatsApp Integration */}
            <View style={styles.cardItem}>
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
                  <Text style={styles.cardText}>Connect to WhatsApp</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.switchLabel}>{whatsappEnabled ? 'On' : 'Off'}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* More Integrations */}
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => handlePress('more-integrations')}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardText}>More Integrations...</Text>
                </View>
                <View style={styles.cardRight}>
                  <View style={styles.integrationIcons}>
                    <MaterialCommunityIcons name="whatsapp" size={20} color="#25D366" />
                    <Ionicons name="logo-google" size={20} color="#4285F4" style={styles.iconSpacing} />
                    <Ionicons name="logo-facebook" size={20} color="#1877F2" style={styles.iconSpacing} />
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* People Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>People</Text>

          <View style={styles.cardGroup}>
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => handlePress('manage-people')}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <View style={styles.peopleIcon}>
                    <Ionicons name="people" size={20} color="#FFFFFF" />
                  </View>
                  <Text style={styles.cardText}>Manage People & Permissions</Text>
                </View>
                <View style={styles.cardRight}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bucket Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bucket Actions</Text>

          <View style={styles.cardGroup}>
            {/* Handedness Toggle */}
            <View style={styles.cardItem}>
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <FontAwesome5 name="hand-paper" size={18} color="#1C47CB" />
                  <Text style={styles.cardText}>Left Handed</Text>
                </View>
                <View style={styles.cardRight}>
                  <Switch
                    value={isRightHanded}
                    onValueChange={(value) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onHandednessChange(value);
                    }}
                    trackColor={{ false: '#E5E5EA', true: '#1C47CB' }}
                    thumbColor={isRightHanded ? '#FFFFFF' : '#FFFFFF'}
                    ios_backgroundColor="#E5E5EA"
                    style={styles.switch}
                  />
                  <Text style={styles.cardText}>Right Handed</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Transfer Ownership */}
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => handlePress('transfer-ownership')}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Ionicons name="swap-horizontal" size={20} color="#1C47CB" />
                  <Text style={styles.cardText}>Transfer Bucket Ownership</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Notifications */}
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => handlePress('notifications')}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Ionicons name="notifications" size={20} color="#1C47CB" />
                  <Text style={styles.cardText}>Bucket Notifications</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Delete Bucket */}
            <TouchableOpacity
              style={styles.cardItem}
              onPress={() => handlePress('delete-bucket')}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardLeft}>
                  <Ionicons name="trash" size={20} color="#FF3B30" />
                  <Text style={[styles.cardText, styles.deleteText]}>Delete Bucket</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Created by you on August 12th, 2021</Text>
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
    zIndex: 2, // Below hero (10) and navigation but above gallery
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 178, // Space for HeroHeader plus small gap
    paddingBottom: 110, // Space for BottomNav
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 2,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 10,
  },
  editIcon: {
    padding: 8,
  },
  saveButton: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#1C47CB',
    fontWeight: '500',
  },
  cardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardItem: {
    backgroundColor: 'transparent',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#E5E5EA',
    marginLeft: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 15,
    color: '#000000',
    marginLeft: 12,
  },
  deleteText: {
    color: '#FF3B30',
  },
  switchLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 6,
  },
  switch: {
    marginHorizontal: 8,
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Make switch smaller
  },
  integrationIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  iconSpacing: {
    marginLeft: 3,
  },
  peopleIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1C47CB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1C47CB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
});

export default BucketSettings;