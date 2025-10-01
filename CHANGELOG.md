# Changelog

## Latest Updates

### HomePage with Circular Reveal Animation (Latest)
- **Circular mask reveal** - True unmasking effect using react-native-masked-view
- **Two-part navigation** - Separated home button into its own circular toolbar
- **Activity feed** - HomePage shows activity from all user Buckets
- **Origin animation** - Circle expands from exact home button position (bottom-left)
- **Hard edge reveal** - Clean circular boundary with no blur/feather
- **Synchronized backdrop** - Backdrop fades in as circle grows
- **Static content** - Page content doesn't scale, only mask animates
- **Navigation hiding** - Bottom nav and toolbar hide when HomePage is open
- **Performance improvements** - Doubled photos to 100, slowed nav transitions to 650ms

### Brand Color Theming & UX Improvements
- **Brand color application** - Updated all UI elements to use brand blue (#1C47CB)
- **Gradient add button** - Applied diagonal gradient from #1C47CB to #02E39F
- **Enhanced touch targets** - ScrollToolbar buttons now 44pt minimum (Apple HIG compliant)
- **Navigation context** - Set media tab as active (appropriate for gallery page)
- **Icon updates** - Changed to images-outline and albums-outline for better semantics
- **Gradient optimization** - Reduced overlay intensity (0.9→0.75) and height (500px→180px)
- **Bounce protection** - Added scroll boundary detection to prevent nav switching during overscroll
- **Mirror gradients** - Hero and bottom nav gradients now perfectly mirror each other

### Dual Navigation System
- **BottomNav component** - Main navigation with Home, Media, Albums, Settings, Add button
- **ScrollToolbar component** - Secondary toolbar with Filter, Sort, More, Select buttons
- **Static gradient overlay** - Full-width gradient at bottom that remains constant
- **Scroll-based navigation swap** - BottomNav hides and ScrollToolbar appears when scrolling down
- **Unified animation timing** - Both toolbars use 500ms animations for smooth transitions

### Hero Animation Updates
- **Position-based animation restored** - Hero animates based on scroll position (0-300px range)
- **Gallery tracks both** - Sends both position (for hero) and direction (for navigation) to parent
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