// AnimationControls.js - Bezier curve preset panel for animation timing
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AnimationControls = ({ onValuesChange, isVisible }) => {
  const [selectedPreset, setSelectedPreset] = useState('Cubic Out');

  const presets = [
    { name: 'Linear', x1: 0, y1: 0, x2: 1, y2: 1, duration: 750 },
    { name: 'Ease', x1: 0.25, y1: 0.1, x2: 0.25, y2: 1, duration: 750 },
    { name: 'Ease In', x1: 0.42, y1: 0, x2: 1, y2: 1, duration: 750 },
    { name: 'Ease Out', x1: 0, y1: 0, x2: 0.58, y2: 1, duration: 750 },
    { name: 'Ease In Out', x1: 0.42, y1: 0, x2: 0.58, y2: 1, duration: 750 },
    { name: 'Cubic Out', x1: 0.33, y1: 1, x2: 0.68, y2: 1, duration: 750 },
    { name: 'Quart Out', x1: 0.25, y1: 1, x2: 0.5, y2: 1, duration: 800 },
    { name: 'Expo Out', x1: 0.19, y1: 1, x2: 0.22, y2: 1, duration: 900 },
    { name: 'Back Out', x1: 0.34, y1: 1.56, x2: 0.64, y2: 1, duration: 850 },
    { name: 'Slow End', x1: 0.1, y1: 0.9, x2: 0.2, y2: 1, duration: 1000 },
  ];

  const applyPreset = (preset) => {
    setSelectedPreset(preset.name);
    onValuesChange({
      x1: preset.x1,
      y1: preset.y1,
      x2: preset.x2,
      y2: preset.y2,
      duration: preset.duration,
    });
  };

  if (!isVisible) return null;

  const currentPreset = presets.find(p => p.name === selectedPreset) || presets[5];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Animation Presets</Text>
        <Text style={styles.bezierText}>
          cubic-bezier({currentPreset.x1.toFixed(2)}, {currentPreset.y1.toFixed(2)}, {currentPreset.x2.toFixed(2)}, {currentPreset.y2.toFixed(2)})
        </Text>
        <Text style={styles.durationText}>Duration: {currentPreset.duration}ms</Text>
      </View>

      <ScrollView style={styles.presetsContainer} showsVerticalScrollIndicator={false}>
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.name}
            style={[
              styles.presetButton,
              selectedPreset === preset.name && styles.presetButtonActive
            ]}
            onPress={() => applyPreset(preset)}
          >
            <View style={styles.presetContent}>
              <Text style={[
                styles.presetText,
                selectedPreset === preset.name && styles.presetTextActive
              ]}>
                {preset.name}
              </Text>
              <Text style={styles.presetDetails}>
                {preset.duration}ms • ({preset.x1}, {preset.y1}, {preset.x2}, {preset.y2})
              </Text>
            </View>
            {selectedPreset === preset.name && (
              <Ionicons name="checkmark-circle" size={20} color="#1C47CB" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.instructions}>
        Tap presets to test different closing animations
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    maxHeight: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  bezierText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#1C47CB',
    marginBottom: 2,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  presetsContainer: {
    marginBottom: 15,
    maxHeight: 260,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  presetButtonActive: {
    backgroundColor: '#E8F0FF',
    borderWidth: 1,
    borderColor: '#1C47CB',
  },
  presetContent: {
    flex: 1,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  presetTextActive: {
    color: '#1C47CB',
  },
  presetDetails: {
    fontSize: 11,
    color: '#888',
    fontFamily: 'monospace',
  },
  instructions: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AnimationControls;