# 🎭 Global Spotlights - Always Visible & Scroll-Following

## ✅ Implementation Complete

### What Was Added

**GlobalSpotlights Component** (`src/components/GlobalSpotlights.jsx`)
- Fixed position overlay that appears on **ALL pages**
- Never hides or disappears
- Follows scroll smoothly on every page
- 3 professional stage spotlights

### Features

#### 1. **Always Visible** 🔦
- Spotlights are **fixed** to the viewport
- Appear on every page: Home, Network, Spaces, Experience, Gallery, Contact
- Never fade out or hide
- Persistent theatrical atmosphere

#### 2. **Scroll-Following Animation** 📜
- Spotlights track your scroll position in real-time
- Smooth Y-position updates (0.02 multiplier for subtle movement)
- Lerp interpolation for fluid transitions
- Responds to `window.scrollY` on any page

#### 3. **Three Spotlights** 💡

**Left Spotlight (Gold)**
- Position: Left side of screen
- Color: #FFD700 (Gold)
- Sways left with sine wave

**Right Spotlight (Pink)**
- Position: Right side of screen
- Color: #FF69B4 (Hot Pink)
- Sways right with sine wave

**Center Spotlight (Purple)**
- Position: Center-top of screen
- Color: #A78BFA (Purple - brand color)
- Centered illumination

#### 4. **Continuous Animations** ✨
- **Rotation**: Gentle Y-axis (sine 0.5 speed) and X-axis (cosine 0.3 speed)
- **Sway**: Horizontal drift based on side (2px amplitude)
- **Beam Pulse**: Opacity oscillates 0.12-0.17 (2Hz frequency)
- **Glow Effect**: Soft sphere around each light

#### 5. **Realistic Design** 🎬
- Metallic housing with high metalness (0.9)
- Glowing lens with emissive material
- Volumetric light beam (40 units long)
- Mounting bracket detail
- Point light emission for scene lighting

### Technical Details

**Rendering**
- Fixed position overlay with `z-index: 50`
- Pointer events disabled (doesn't block clicks)
- Screen blend mode for realistic light mixing
- Canvas size: Full viewport

**Performance**
- Efficient scroll listener with cleanup
- Smooth lerp interpolation (0.05 factor)
- Optimized geometry (low poly count)
- Single Canvas for all 3 lights

**Integration**
- Added to `App.jsx` at root level
- Renders above 3D background, below header
- Works with all routing (React Router)
- Independent of page-specific 3D scenes

### Visual Result

When you scroll on **any page**:
1. ✅ 3 spotlights are always visible
2. ✅ They smoothly follow your scroll down/up
3. ✅ Gentle rotation and sway animations
4. ✅ Pulsing light beams
5. ✅ Creates cinematic theatrical atmosphere
6. ✅ Never disappears or hides

### Pages Affected

- ✅ **Home** (`/`)
- ✅ **Network** (`/network`)
- ✅ **Spaces** (`/spaces`)
- ✅ **Experience** (`/experience`)
- ✅ **Gallery** (`/gallery`)
- ✅ **Contact** (`/contact`)

All pages now have persistent stage lighting that follows the user! 🎭✨

### Customization Options

To adjust spotlight behavior, edit `GlobalSpotlights.jsx`:

```jsx
// Scroll sensitivity (higher = faster follow)
const targetY = position[1] + (scrollY.current * 0.02) // Change 0.02

// Sway amount
const sway = Math.sin(time * 0.4) * 2 // Change 2 for more/less sway

// Rotation speed
groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.3 // Change 0.5

// Beam opacity
beamRef.current.material.opacity = 0.12 + Math.sin(time * 2) * 0.05
```

### Z-Index Hierarchy

```
100 - Noise overlay
50  - Global Spotlights ⭐ (NEW)
10  - Page content
0   - 3D background
```

The spotlights sit between the 3D background and page content, creating perfect atmospheric lighting!
