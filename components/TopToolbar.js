// TopToolbar.js - Top toolbar that stays above gallery scroll
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { DotsNine, HouseSimple, UserPlus, X } from 'phosphor-react-native';
import * as Haptics from 'expo-haptics';

const TopToolbar = ({ onHomePress, isHomePageOpen }) => {
  const handlePress = (action) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('Pressed:', action);
  };

  const handleHomePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onHomePress) {
      onHomePress();
    }
  };

  return (
    <View style={styles.container}>
      {/* Hamburger Menu */}
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={() => handlePress('hamburger')}
        activeOpacity={0.7}
      >
        <DotsNine size={21} color="#1C47CB" weight="bold" />
      </TouchableOpacity>

      {/* Home Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={handleHomePress}
        activeOpacity={0.7}
      >
        {isHomePageOpen ? (
          <X size={21} color="#1C47CB" weight="fill" />
        ) : (
          <HouseSimple size={21} color="#1C47CB" weight="fill" />
        )}
      </TouchableOpacity>

      {/* Invite Button */}
      <TouchableOpacity
        style={styles.inviteButton}
        onPress={() => handlePress('add-user')}
        activeOpacity={0.7}
      >
        <UserPlus size={21} color="#1C47CB" weight="fill" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 15, // Highest z-index - stays above gallery
  },
  // Hamburger menu
  hamburgerButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  // Home button
  homeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  // Invite button
  inviteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default TopToolbar;