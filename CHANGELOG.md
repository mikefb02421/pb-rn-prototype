# Changelog

## Latest Updates

### Bidirectional Hero Animation (Latest)
- **Hero responds to scroll direction, not position** - Animation triggers immediately when user changes from scrolling down to up (or vice versa)
- **No need to scroll to top** - Hero expands as soon as you start scrolling up, regardless of position
- **Smooth 400ms transitions** - Using cubic easing for natural feel
- **Optimized spacing** - Reduced internal spacing (8pt spacer, 4pt padding) and hero height (168px)
- **Avatar improvements** - Faster fade (50% of animation) with up+right movement

### Modular Architecture
- **Separated components** - HeroHeader.js, Gallery.js, App.js for clean development
- **Expo Snack ready** - Multi-file structure with setup guide
- **Gallery with scroll detection** - Tracks scroll direction changes with 2px sensitivity threshold

### Hero Animation Features
- **Background image fade** - Smooth transition from hero image to photo grid
- **Apple Photos-style gradient** - 10-color smooth fade overlay for hamburger menu clarity
- **Search bar expansion** - Moves up and widens to fill space between hamburger and invite button
- **Avatar stack animation** - Slide up+right with fade out
- **Title fade** - Clean disappearance of "MTB Crew!" text
- **Invite button slide** - Moves up to align with hamburger menu

### Technical Implementation
- React Native Reanimated 3 for 60fps animations
- expo-linear-gradient for smooth gradient overlays
- useAnimatedScrollHandler for UI thread performance
- Modular component architecture for scalability
- Direction-based animation system with immediate response