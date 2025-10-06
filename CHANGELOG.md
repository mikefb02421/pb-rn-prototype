# Changelog

## Latest Updates

### Gallery Scroll Over Animation Complete (Latest - v0.4.0)
- **Gallery Layering** - Gallery now scrolls over hero background with proper z-index layering
- **TopToolbar Component** - New fixed top navigation with white circular buttons and Phosphor icons
- **Scroll-Responsive Ken Burns** - Hero image zoom reverses as user scrolls (1.25x to 1.10x range)
- **HomePage Dynamic Origins** - Circular reveal animation can originate from TopToolbar or BottomNav
- **Local Moab Images** - Replaced Picsum placeholders with 28 custom Moab adventure photos
- **Gallery Polish** - Added 2px border radius to thumbnails for subtle rounded corners
- **Smart Backgrounds** - Transparent gallery with white background only where images appear
- **Gradient Contrast** - Fixed gradient overlay z-index for optimal toolbar visibility
- **HomePageMask Close Button** - Added circular X button in white bottom container
- **Image Processing Pipeline** - Automated cropping and resizing with ImageMagick

### HeroHeaderCover with Ken Burns Effect (v0.3.0)
- **HeroHeaderCover Component** - New cinematic hero header replacing previous variants
- **Ken Burns Effect** - Subtle 20-second animation cycles with 1.15x-1.25x zoom range
- **Pan Animation** - Smooth ±25px horizontal, ±15px vertical movement with sine easing
- **Header Overlay Tools** - Hamburger menu, home button, invite button, user avatars, title
- **Combined Effects** - Ken Burns animation works seamlessly with overscroll zoom
- **Overscroll Zoom** - Pull-to-zoom effect from 1.0x to 1.15x scale when scrolling past top
- **Layout Improvements** - Container overflow handling prevents layout issues
- **Optimized Sizing** - Title reduced to 36px, avatars to 32px, spacing to 8px for better proportions
- **Scroll Direction Fix** - Fixed navigation state when returning to top of gallery
- **Square Hero Format** - Full-width square hero image with proper aspect ratio

### Bucket Settings Page & Handedness Toggle
- **Bucket Settings page** - Full settings page with grouped cards layout matching Figma design
- **Card grouping** - Sections use single white blocks with divider lines between items
- **Handedness toggle** - Switch between left/right handed navigation layout in BottomNavAlt
- **Dynamic layout** - Home button and main nav pill swap positions based on preference
- **Navigation routing** - Settings gear icon opens settings, media icon returns to gallery
- **Compact navigation** - Reduced bottom nav height from 72px to 60px for better proportions
- **Consistent spacing** - 12px gap maintained between navigation elements in both modes
- **Visual refinements** - 16px settings title, muted gray colors, improved touch targets

### SVG Dependency Fix & Navigation Refinement
- **SVG conflict resolution** - Replaced SVG circular mask with animated View to eliminate RNSVGCircle registration conflicts
- **Two-part navigation system** - Split navigation into separate containers with proper z-index layering
- **Elevated home button** - Home button (z-index 1000) stays visible above HomePage (z-index 999) with animated shadow
- **Icon transformation** - Home button changes to close icon when HomePage is active
- **Animation controls framework** - Created AnimationControls component for real-time bezier curve testing (disabled due to slider dependency)
- **Dependency cleanup** - Removed conflicting package-snack.json and unnecessary react-native-svg dependency
- **Enhanced timing** - Custom bezier curve support with Easing.bezier() for precise animation control
- **Hook optimization** - Fixed React Hook dependency warnings in useEffect calls

### HomePage with Circular Reveal Animation
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