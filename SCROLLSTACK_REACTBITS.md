# ScrollStack Implementation - ReactBits Official

## Overview
Replaced custom ScrollStack implementation with the **official ReactBits ScrollStack** component for better reliability and proper Lenis integration.

## Source
- **Component**: https://reactbits.dev/components/scroll-stack
- **Implementation**: Official ReactBits library

## Key Features

### 1. **Proper Lenis Integration**
The official implementation includes built-in Lenis smooth scroll support with two modes:
- `useWindowScroll={true}` - Uses global window scroll (integrates with existing Lenis in App.jsx)
- `useWindowScroll={false}` - Creates its own Lenis instance for the container

### 2. **Smooth Card Stacking**
- Cards stack on top of each other as you scroll
- Smooth scale transitions
- Optional blur effect for depth
- Proper z-index layering

### 3. **Performance Optimized**
- Hardware-accelerated transforms
- Efficient change detection
- RAF-based updates
- Proper cleanup on unmount

## Configuration

### Current Settings (Gallery.jsx)
```jsx
<ScrollStack
    itemDistance={200}          // Space between card origins
    stackPosition="15%"         // Where cards pin (from top)
    itemStackDistance={10}      // Vertical offset between stacked cards
    baseScale={0.88}           // Scale of fully stacked cards
    blurAmount={6}             // Blur intensity for depth
    useWindowScroll={true}     // Use global Lenis instance
>
```

### Available Props
- `itemDistance` - Distance between card origins (default: 100)
- `itemScale` - Scale increment per card (default: 0.03)
- `itemStackDistance` - Vertical spacing in stack (default: 30)
- `stackPosition` - Pin position from top (default: "20%")
- `scaleEndPosition` - Where scaling ends (default: "10%")
- `baseScale` - Minimum scale (default: 0.85)
- `rotationAmount` - Rotation per card (default: 0)
- `blurAmount` - Blur intensity (default: 0)
- `useWindowScroll` - Use window scroll vs container (default: false)
- `onStackComplete` - Callback when stack completes

## Benefits Over Custom Implementation

✅ **No Shaking** - Proper Lenis integration eliminates jitter  
✅ **Better Timing** - Optimized scroll calculations  
✅ **Tested & Reliable** - Battle-tested component from ReactBits  
✅ **Proper Cleanup** - No memory leaks or orphaned listeners  
✅ **Mobile Optimized** - Touch and gesture support built-in  

## Files Modified
- `src/components/ReactBits/ScrollStack.jsx` - Official implementation
- `src/components/ReactBits/ScrollStack.css` - Official styles (customized for our design)
- `src/sections/Gallery.jsx` - Added `useWindowScroll={true}`

## Integration Notes

### Why `useWindowScroll={true}`?
Your app already has a global Lenis instance in `App.jsx`. Setting `useWindowScroll={true}` tells ScrollStack to:
1. Use the existing global Lenis instance
2. Not create a duplicate Lenis instance
3. Integrate seamlessly with your app's smooth scroll

### Lenis Conflict Prevention
The official implementation checks for `useWindowScroll` and either:
- Hooks into window scroll events (when true)
- Creates its own Lenis instance (when false)

This prevents the double-Lenis issue that was causing conflicts.

## Result
🎯 Smooth, professional card stacking  
🎯 No shaking or jitter  
🎯 Proper timing between cards  
🎯 Perfect integration with existing Lenis  
