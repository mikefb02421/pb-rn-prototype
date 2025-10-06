# MTB Crew - React Native Photo Gallery App

A sophisticated React Native photo sharing application designed for mountain biking groups, featuring cinematic hero headers, smooth animations, and intuitive navigation.

## Project Overview

This app provides a premium photo sharing experience with focus on visual storytelling and group collaboration. Built for MTB crews to share their adventures with stunning visual presentation and smooth user interactions.

## Current Status

**Phase**: Gallery Scroll Over Animation Complete
**Last Updated**: 2025-01-05
**Version**: 0.4.0 - "Plain Gallery Scroll Over" Milestone

## Key Features

### 🎬 Cinematic Hero Headers
- **HeroHeaderCover**: Square hero images with Ken Burns effect (1.15x-1.25x zoom, 20s cycles)
- **Scroll-Responsive Animation**: Ken Burns effect reverses as user scrolls (zoom-out effect)
- **Local Image Support**: Uses custom Moab adventure photos instead of placeholder images
- **Overscroll Zoom**: Pull-to-zoom effect combined with Ken Burns animation
- **Layered Architecture**: Hero background (z-index: 5) with gallery scrolling over it

### 📱 Advanced Navigation
- **TopToolbar**: White circular buttons with Phosphor icons (DotsNine, HouseSimple, UserPlus)
- **Smart Bottom Navigation**: Context-aware hiding/showing based on scroll direction
- **ScrollToolbar**: Secondary toolbar with search, filter, sort, and select options
- **HomePage Mask**: Circular reveal animation from multiple button origins (top/bottom)
- **Collections Page**: Albums, smart albums, people recognition, and events

### 🖼️ Photo Gallery
- **Layered Scroll**: Gallery scrolls over hero background with proper z-index layering
- **Local Images**: 28 Moab adventure photos cycling through 100-item grid
- **Polished Thumbnails**: 2px border radius for subtle rounded corners
- **Smart Background**: Transparent gallery with white background only where images appear
- **Gradient Overlay**: Subtle gradient behind toolbar for optimal contrast

## Technical Stack

- **React Native**: 0.73+ with Expo managed workflow
- **Animations**: react-native-reanimated v3 for smooth 60fps animations
- **UI Components**: Custom components with haptic feedback
- **Icons**: Phosphor React Native for consistent iconography
- **Effects**: LinearGradient, BlurView, MaskedView for visual effects
- **Image Processing**: ImageMagick for batch cropping and resizing
- **Platform**: iOS and Android compatible via Expo Snack

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
- **App.js**: Main app container with scroll animation state and button position tracking
- **HeroHeaderCover.js**: Cinematic hero with scroll-responsive Ken Burns effect
- **TopToolbar.js**: Fixed top navigation with Phosphor icons and white styling
- **Gallery.js**: Layered photo grid that scrolls over hero background
- **BottomNav.js**: Smart navigation bar with scroll-based visibility
- **ScrollToolbar.js**: Secondary toolbar with search and utility functions

### Pages
- **Collections.js**: Albums, smart albums, people, and events sections
- **HomePageMask.js**: Activity feed with dynamic circular reveal animation from multiple origins
- **BucketSettings.js**: App settings with handedness toggle

## Animation System

### Ken Burns Effect
- **Duration**: 20 second cycles with reverse animation
- **Scale Range**: 1.15x to 1.25x (subtle cinematic zoom)
- **Scroll Response**: Reverses zoom effect as user scrolls (1.25x down to 1.10x minimum)
- **Pan Movement**: ±25px horizontal, ±15px vertical
- **Easing**: `Easing.inOut(Easing.sin)` for organic motion

### Scroll Interactions
- **Gallery Layering**: Gallery (z-index: 10) scrolls over hero background (z-index: 5)
- **Direction Detection**: Smart scroll direction with top/bottom boundary handling
- **Overscroll Zoom**: Pull-to-zoom effect (1.0x to 1.15x scale)
- **UI Transitions**: 650ms smooth navigation bar animations
- **Gradient Overlay**: Dynamic gradient (z-index: 12) provides toolbar contrast

### Circular Animations
- **HomePage Mask**: 850ms circular reveal with `Easing.inOut(Easing.quad)`
- **Dynamic Origins**: Animation starts from TopToolbar or BottomNav button positions
- **Close Animation**: Same timing and easing for seamless reverse effect