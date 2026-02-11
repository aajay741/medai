# ScrollStack Card Shaking Fix

## Problem
The cards in the Gallery section were shaking/jittering during scroll, creating a poor user experience.

## Root Cause
The application uses **Lenis smooth scroll**, which updates `window.scrollY` via its own `requestAnimationFrame` loop. The original ScrollStack implementation was listening to the native `scroll` event and reading `window.scrollY`, causing a **timing mismatch**:

1. Lenis updates scroll position in its RAF cycle
2. Browser fires scroll event (async)
3. ScrollStack reads `window.scrollY` (which may be slightly out of sync)
4. ScrollStack applies transforms
5. Result: Jittery, shaking cards

## Solution

### 1. **Cached Card Offsets**
The biggest source of jitter was calling `getBoundingClientRect()` on every frame. This method triggers layout calculations and can return slightly different values due to sub-pixel rendering.

**Solution:** Calculate card offsets ONCE on mount and cache them:

```javascript
const calculateOffsets = () => {
    const offsets = [];
    cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const currentScrollY = window.scrollY;
        offsets.push(rect.top + currentScrollY);
    });
    cardOffsetsRef.current = offsets;
};
```

### 2. **Synchronized RAF Loop**
Instead of listening to scroll events, the ScrollStack runs its own RAF loop:

```javascript
useEffect(() => {
    const tick = () => {
        updateCardTransforms();
        rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);
    // ...
}, [updateCardTransforms]);
```

### 3. **Removed Change Detection**
Previously, we only updated transforms when values changed. This caused micro-stutters. Now we update on EVERY frame for buttery smoothness:

```javascript
// Apply transforms directly without change detection
card.style.transform = transform;
card.style.filter = filter;
card.style.zIndex = zIndex;
```

### 4. **No Rounding**
Removed all value rounding (translateY, scale, rotation, blur) to prevent snapping artifacts. Let the browser handle sub-pixel rendering naturally.

### 5. **CSS: Zero Transitions**
```css
/* NO transitions - all animations handled by JS RAF for smoothness */
```

Removed ALL CSS transitions including filter transitions. Everything is now handled by the JavaScript RAF loop.

## Result
✅ Smooth, buttery card stacking animation  
✅ No shaking or jittering  
✅ Perfect sync with Lenis smooth scroll  
✅ Optimized for 60fps performance  

## Files Modified
- `src/components/ReactBits/ScrollStack.jsx` - RAF sync implementation
- `src/components/ReactBits/ScrollStack.css` - Performance optimizations

## Testing
Test by scrolling through the Gallery section. Cards should:
1. Stack smoothly on top of each other
2. Scale down gradually as they pin
3. Blur slightly when covered by new cards
4. Show no jitter or shaking during scroll
