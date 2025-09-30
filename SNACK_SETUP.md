# Expo Snack Multi-File Setup Guide

## Files Created:
1. `App.js` - Main entry point that combines everything
2. `components/HeroHeader.js` - Hero header component (stable)
3. `components/Gallery.js` - Photo grid component with scroll detection
4. `components/BottomNav.js` - Bottom navigation with gradient overlay
5. `components/ScrollToolbar.js` - Secondary toolbar for scroll state

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
  "expo-linear-gradient": "~13.0.2",
  "react-native-reanimated": "~3.10.1",
  "react-native-gesture-handler": "~2.16.1",
  "@expo/vector-icons": "*",
  "expo-blur": "~13.0.2",
  "expo-haptics": "*"
}
```

## Your Workflow:
- **Hero Header is stable** - Features bidirectional scroll animations, you won't need to edit this much
- **Gallery is stable** - Photo grid with scroll direction detection is separated
- **Focus on new components** - When you add BottomNav, create `components/BottomNav.js`
- **App.js orchestrates** - Import and combine all components here

## Latest Features:
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
│   ├── HeroHeader.js (your finished hero)
│   ├── Gallery.js (photo grid)
│   └── BottomNav.js (you'll create this next)
└── package.json
```

## Benefits:
✅ See all components together in live preview
✅ Only edit the files you're actively working on
✅ Clean separation of concerns
✅ Easy to debug individual components
✅ Hero header stays stable while you build other features