# Expo Snack Multi-File Setup Guide

## Files Created:
1. `App.js` - Main entry point that combines everything
2. `components/HeroHeader.js` - Hero header component (stable)
3. `components/Gallery.js` - Photo grid component with scroll detection
4. `components/BottomNavAlt.js` - Two-part navigation with separated home button
5. `components/ScrollToolbar.js` - Secondary toolbar for scroll state
6. `components/HomePageMask.js` - Full-screen HomePage with circular reveal animation
7. `components/AnimationControls.js` - Bezier curve testing panel (disabled due to dependencies)

## How to Upload to Expo Snack:

### Step 1: Create New Snack
1. Go to https://snack.expo.dev
2. Create a new snack
3. Name it "MTB Gallery - Modular Components"

### Step 2: Upload Files
1. **Replace App.js**: Copy the contents of `App.js` and paste into the main App.js in Snack
2. **Create components folder**:
   - Click the "+" button next to "Files" in the left sidebar
   - Create a new file called `components/HeroHeader.js`
   - Copy the contents of `components/HeroHeader.js` and paste it
3. **Add Gallery component**:
   - Create another file called `components/Gallery.js`
   - Copy the contents of `components/Gallery.js` and paste it

### Step 3: Add Dependencies
Add to package.json dependencies:
```json
{
  "expo-linear-gradient": "~15.0.7",
  "react-native-reanimated": "~4.1.0",
  "react-native-gesture-handler": "~2.28.0",
  "@expo/vector-icons": "^15.0.2",
  "expo-blur": "~15.0.7",
  "expo-haptics": "~15.0.7",
  "@react-native-masked-view/masked-view": "0.3.2"
}
```

## Your Workflow:
- **Hero Header is stable** - Features bidirectional scroll animations, you won't need to edit this much
- **Gallery is stable** - Photo grid with scroll direction detection is separated
- **Focus on new components** - When you add BottomNav, create `components/BottomNav.js`
- **App.js orchestrates** - Import and combine all components here

## Latest Features:
- **HomePage with circular reveal** - Full-screen overlay that expands from home button with custom bezier timing
- **Two-part navigation system** - Split home button (z-index 1000) and main nav (z-index 101) for proper layering
- **Animated shadows** - Home button gains elevation shadow when HomePage opens
- **Icon transformation** - Home button becomes close button when HomePage is active
- **Dual navigation system** - BottomNav and ScrollToolbar swap based on scroll
- **Static gradient overlay** - Constant bottom gradient that doesn't animate
- **Position-based hero** - Hero animates based on scroll position (0-300px)
- **Direction-based toolbars** - Navigation swaps instantly on scroll direction change
- **Optimized pill design** - 44pt height, proper spacing, blur effects

## Adding New Components (e.g., BottomNav):
1. Create `components/BottomNav.js` in Snack
2. Build your component there
3. Import it in App.js: `import BottomNav from './components/BottomNav';`
4. Add it to the render: `<BottomNav />`

## File Structure in Snack:
```
📁 Your Snack
├── App.js (imports and combines everything)
├── components/
│   ├── HeroHeader.js (hero header with scroll animations)
│   ├── Gallery.js (photo grid with scroll detection)
│   ├── BottomNavAlt.js (two-part navigation system)
│   ├── ScrollToolbar.js (secondary toolbar)
│   ├── HomePageMask.js (circular reveal HomePage)
│   └── AnimationControls.js (disabled - bezier testing)
└── package.json
```

## Benefits:
✅ See all components together in live preview
✅ Only edit the files you're actively working on
✅ Clean separation of concerns
✅ Easy to debug individual components
✅ Hero header stays stable while you build other features