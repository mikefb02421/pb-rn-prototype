# MTB Crew - React Native Photo Gallery App

A sophisticated React Native photo sharing application designed for mountain biking groups, featuring cinematic hero headers, smooth animations, and intuitive navigation.

## Project Overview

This app provides a premium photo sharing experience with focus on visual storytelling and group collaboration. Built for MTB crews to share their adventures with stunning visual presentation and smooth user interactions.

## Current Status

**Phase**: Advanced UI Development
**Last Updated**: 2025-01-03
**Version**: 0.3.0

## Key Features

### 🎬 Cinematic Hero Headers
- **HeroHeaderCover**: Square hero images with Ken Burns effect (1.15x-1.25x zoom, 20s cycles)
- **Interactive Elements**: Hamburger menu, home button, invite functionality, user avatars
- **Overscroll Zoom**: Pull-to-zoom effect combined with Ken Burns animation
- **Responsive Design**: Optimized spacing and sizing for mobile devices

### 📱 Advanced Navigation
- **Smart Bottom Navigation**: Context-aware hiding/showing based on scroll direction
- **ScrollToolbar**: Secondary toolbar with search, filter, sort, and select options
- **Collections Page**: Albums, smart albums, people recognition, and events
- **HomePage**: Circular reveal animation with activity feed

### 🖼️ Photo Gallery
- **Optimized Grid**: 3-column responsive layout with 100 placeholder images
- **Smooth Scrolling**: Enhanced scroll detection with direction-based UI changes
- **Ken Burns Effect**: Cinematic background image animation

## Technical Stack

- **React Native**: 0.73+ with Expo managed workflow
- **Animations**: react-native-reanimated v3 for smooth 60fps animations
- **UI Components**: Custom components with haptic feedback
- **Icons**: @expo/vector-icons (Ionicons, MaterialCommunityIcons)
- **Effects**: LinearGradient, BlurView, MaskedView for visual effects
- **Platform**: iOS and Android compatible

## Development Setup

### Expo Development
```bash
# Install Expo CLI
npm install -g @expo/cli

# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS Simulator
npx expo start --ios

# Run on Android Emulator
npx expo start --android
```

### Local Development
```bash
# Install dependencies
npm install

# iOS (requires Xcode)
cd ios && pod install && cd ..
npx react-native run-ios

# Android (requires Android Studio)
npx react-native run-android
```

## Component Architecture

### Core Components
- **App.js**: Main app container with navigation state management
- **HeroHeaderCover.js**: Cinematic hero header with Ken Burns effect
- **Gallery.js**: Photo grid with scroll detection and overscroll handling
- **BottomNav.js**: Smart navigation bar with scroll-based visibility
- **ScrollToolbar.js**: Secondary toolbar with search and utility functions

### Pages
- **Collections.js**: Albums, smart albums, people, and events sections
- **HomePage.js**: Activity feed with circular reveal animation
- **BucketSettings.js**: App settings with handedness toggle

## Animation System

### Ken Burns Effect
- **Duration**: 20 second cycles with reverse animation
- **Scale Range**: 1.15x to 1.25x (subtle cinematic zoom)
- **Pan Movement**: ±25px horizontal, ±15px vertical
- **Easing**: `Easing.inOut(Easing.sin)` for organic motion

### Scroll Interactions
- **Direction Detection**: Smart scroll direction with top/bottom boundary handling
- **Overscroll Zoom**: Pull-to-zoom effect (1.0x to 1.15x scale)
- **UI Transitions**: 650ms smooth navigation bar animations
- **Combined Effects**: Ken Burns + overscroll work together seamlessly