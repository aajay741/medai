# React Bits Components - Usage Guide

A premium collection of animated React components inspired by [React Bits](https://reactbits.dev).

## 📦 Components Included

1. **AntigravityText** - Text that floats upward with gravity-defying animation
2. **SplitText** - Character/word-level staggered reveal animations
3. **TextType** - Classic typewriter effect
4. **ShuffleText** - Matrix-style character shuffling reveal
5. **GradientText** - Animated gradient text effects
6. **ScrollFloat** - Scroll-based parallax floating elements
7. **BubbleMenu** - Floating bubble navigation menu
8. **DarkVeil** - Animated dark gradient background overlay
9. **LightRays** - Radial light beam background effect

## 🚀 Quick Start

### Import Components

```jsx
// Import individual components
import { AntigravityText, SplitText, GradientText } from './components/ReactBits';

// Or import all
import * as ReactBits from './components/ReactBits';
```

### View Demo

To see all components in action, import and use the demo page:

```jsx
import ReactBitsDemo from './components/ReactBitsDemo';

function App() {
  return <ReactBitsDemo />;
}
```

## 📖 Component Documentation

### 1. AntigravityText

Text that animates upward with a floating effect.

**Props:**
- `children` (string) - The text to animate
- `className` (string) - Additional CSS classes
- `delay` (number) - Animation start delay in seconds (default: 0)
- `duration` (number) - Animation duration in seconds (default: 1.2)
- `floatDistance` (number) - Distance to float in pixels (default: -20)
- `stagger` (number) - Delay between each word in seconds (default: 0.05)

**Example:**
```jsx
<AntigravityText 
  className="text-6xl font-bold"
  delay={0.2}
  duration={1.5}
  floatDistance={-30}
  stagger={0.08}
>
  Welcome to the Future
</AntigravityText>
```

### 2. SplitText

Animates text by splitting into characters or words with various effects.

**Props:**
- `children` (string) - The text to animate
- `className` (string) - Additional CSS classes
- `delay` (number) - Animation start delay (default: 0)
- `duration` (number) - Stagger duration between elements (default: 0.05)
- `animateBy` (string) - 'character' or 'word' (default: 'character')
- `variant` (string) - Animation type: 'fadeUp', 'fadeIn', 'slideLeft', 'slideRight', 'scale' (default: 'fadeUp')

**Example:**
```jsx
<SplitText 
  className="text-4xl"
  animateBy="character"
  variant="fadeUp"
  duration={0.05}
>
  Character by character reveal
</SplitText>

<SplitText 
  animateBy="word"
  variant="scale"
  duration={0.1}
>
  Word by word scaling
</SplitText>
```

### 3. TextType

Classic typewriter animation effect.

**Props:**
- `children` (string) - The text to type out
- `className` (string) - Additional CSS classes
- `speed` (number) - Milliseconds per character (default: 50)
- `delay` (number) - Delay before typing starts (default: 0)
- `showCursor` (boolean) - Show blinking cursor (default: true)
- `cursorChar` (string) - Cursor character (default: '|')
- `onComplete` (function) - Callback when typing completes

**Example:**
```jsx
<TextType 
  className="text-3xl font-mono"
  speed={80}
  showCursor={true}
  cursorChar="|"
  onComplete={() => console.log('Typing complete!')}
>
  This text types out character by character...
</TextType>
```

### 4. ShuffleText

Matrix-style character shuffling before revealing the actual text.

**Props:**
- `children` (string) - The text to reveal
- `className` (string) - Additional CSS classes
- `speed` (number) - Milliseconds per shuffle iteration (default: 50)
- `delay` (number) - Delay before shuffling starts (default: 0)
- `characters` (string) - Characters to use for shuffling
- `onComplete` (function) - Callback when shuffle completes

**Example:**
```jsx
<ShuffleText 
  className="text-4xl font-bold"
  speed={30}
  characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
>
  SHUFFLING TEXT REVEAL
</ShuffleText>
```

### 5. GradientText

Animated gradient text with customizable colors.

**Props:**
- `children` (string) - The text content
- `className` (string) - Additional CSS classes
- `colors` (array) - Array of color values (default: ['#667eea', '#764ba2', '#f093fb', '#4facfe'])
- `animate` (boolean) - Enable animation (default: true)
- `animationDuration` (number) - Animation cycle duration in seconds (default: 3)
- `direction` (string) - 'horizontal' or 'vertical' (default: 'horizontal')

**Example:**
```jsx
<GradientText 
  className="text-5xl font-bold"
  colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
  animationDuration={4}
  direction="horizontal"
>
  Beautiful Gradient Text
</GradientText>
```

### 6. ScrollFloat

Elements that move based on scroll position (parallax effect).

**Props:**
- `children` (ReactNode) - Content to float
- `className` (string) - Additional CSS classes
- `offset` (number) - Maximum movement distance in pixels (default: 50)
- `direction` (string) - 'up', 'down', 'left', 'right' (default: 'up')
- `speed` (number) - Movement speed multiplier (default: 0.5)

**Example:**
```jsx
<ScrollFloat offset={100} direction="up" speed={0.5}>
  <div className="bg-purple-500 rounded-2xl p-8">
    <h3>This floats as you scroll</h3>
  </div>
</ScrollFloat>
```

### 7. BubbleMenu

Floating bubble menu with radial expansion.

**Props:**
- `items` (array) - Menu items with `icon`, `label`, and `onClick`
- `className` (string) - Additional CSS classes
- `bubbleColor` (string) - Bubble background color (default: 'rgba(99, 102, 241, 0.9)')
- `position` (string) - 'bottom-right', 'bottom-left', 'top-right', 'top-left' (default: 'bottom-right')
- `mainIcon` (string) - Main button icon (default: '✨')

**Example:**
```jsx
const menuItems = [
  { icon: '🏠', label: 'Home', onClick: () => navigate('/') },
  { icon: '📧', label: 'Contact', onClick: () => navigate('/contact') },
  { icon: '⚙️', label: 'Settings', onClick: () => navigate('/settings') },
  { icon: '❓', label: 'Help', onClick: () => navigate('/help') },
];

<BubbleMenu 
  items={menuItems}
  bubbleColor="rgba(102, 126, 234, 0.9)"
  position="bottom-right"
  mainIcon="✨"
/>
```

### 8. DarkVeil

Animated dark gradient background overlay.

**Props:**
- `className` (string) - Additional CSS classes
- `colors` (array) - Gradient colors (default: ['#0a0a0a', '#1a1a2e', '#16213e'])
- `animate` (boolean) - Enable animation (default: true)
- `opacity` (number) - Overlay opacity 0-1 (default: 0.9)

**Example:**
```jsx
<div className="relative">
  <DarkVeil 
    colors={['#0a0a0a', '#1a1a2e', '#16213e']} 
    opacity={0.7} 
  />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
```

### 9. LightRays

Radial light beam background effect.

**Props:**
- `className` (string) - Additional CSS classes
- `color` (string) - Ray color (default: '#ffffff')
- `opacity` (number) - Ray opacity 0-1 (default: 0.1)
- `rayCount` (number) - Number of rays (default: 12)
- `animate` (boolean) - Enable animation (default: true)
- `speed` (number) - Animation duration in seconds (default: 20)

**Example:**
```jsx
<div className="relative">
  <LightRays 
    color="#667eea" 
    opacity={0.08} 
    rayCount={16} 
    speed={25} 
  />
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</div>
```

## 🎨 Styling Tips

### Combining Components

```jsx
<div className="relative min-h-screen">
  {/* Background layers */}
  <DarkVeil colors={['#0a0a0a', '#1a1a2e']} opacity={0.8} />
  <LightRays color="#667eea" opacity={0.1} />
  
  {/* Content */}
  <div className="relative z-10">
    <AntigravityText className="text-6xl font-bold">
      <GradientText colors={['#667eea', '#764ba2']}>
        Amazing Title
      </GradientText>
    </AntigravityText>
    
    <ScrollFloat direction="up" offset={80}>
      <SplitText variant="fadeUp">
        Scroll-reactive content
      </SplitText>
    </ScrollFloat>
  </div>
  
  {/* Floating menu */}
  <BubbleMenu items={menuItems} />
</div>
```

### Responsive Design

All components support Tailwind CSS classes for responsive design:

```jsx
<AntigravityText className="text-3xl md:text-5xl lg:text-7xl">
  Responsive Text
</AntigravityText>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <ScrollFloat direction="up">Content 1</ScrollFloat>
  <ScrollFloat direction="down">Content 2</ScrollFloat>
  <ScrollFloat direction="left">Content 3</ScrollFloat>
  <ScrollFloat direction="right">Content 4</ScrollFloat>
</div>
```

## 🎯 Use Cases

### Hero Sections
```jsx
<section className="min-h-screen flex items-center justify-center">
  <div className="text-center">
    <AntigravityText className="text-7xl font-bold mb-6">
      <GradientText colors={['#667eea', '#764ba2']}>
        Your Brand
      </GradientText>
    </AntigravityText>
    
    <SplitText className="text-2xl text-gray-300" variant="fadeUp">
      Crafting digital experiences
    </SplitText>
  </div>
</section>
```

### Feature Showcases
```jsx
<section className="py-20">
  {features.map((feature, index) => (
    <ScrollFloat 
      key={index}
      direction={index % 2 === 0 ? 'left' : 'right'}
      offset={60}
    >
      <div className="feature-card">
        <ShuffleText className="text-3xl font-bold">
          {feature.title}
        </ShuffleText>
        <p>{feature.description}</p>
      </div>
    </ScrollFloat>
  ))}
</section>
```

### Loading States
```jsx
<TextType 
  speed={100}
  onComplete={() => setLoaded(true)}
>
  Loading your experience...
</TextType>
```

## 🔧 Performance Tips

1. **Use `will-change` sparingly** - Only apply to actively animating elements
2. **Limit ScrollFloat instances** - Too many can impact scroll performance
3. **Reduce ray count on mobile** - Use fewer rays in LightRays for better performance
4. **Memoize menu items** - Prevent unnecessary re-renders in BubbleMenu

```jsx
const menuItems = useMemo(() => [
  { icon: '🏠', label: 'Home', onClick: handleHome },
  // ...
], []);
```

## 📱 Browser Support

All components work in modern browsers that support:
- CSS `backdrop-filter`
- CSS `background-clip: text`
- Framer Motion (React 18+)

## 🎓 Credits

Inspired by the amazing work at [React Bits](https://reactbits.dev)

Built with:
- React
- Framer Motion
- Tailwind CSS (optional, but recommended)

---

**Enjoy building beautiful, animated interfaces! ✨**
