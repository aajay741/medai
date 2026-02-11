# React Bits Integration Examples

This document shows practical examples of how to use React Bits components in your MEDAI project.

## Quick Integration into Existing Sections

### Example 1: Enhance Your Hero Section

Replace or enhance your existing Hero component:

```jsx
// src/sections/Hero.jsx
import { AntigravityText, GradientText, SplitText, ScrollFloat, LightRays, DarkVeil } from '../components/ReactBits';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Add background effects */}
      <DarkVeil colors={['#030303', '#0a0a0a']} opacity={0.6} />
      <LightRays color="#667eea" opacity={0.05} rayCount={16} />

      <div className="relative z-10 text-center">
        {/* Animated title */}
        <AntigravityText className="text-8xl font-bold mb-6">
          <GradientText colors={['#667eea', '#764ba2']}>
            MEDAI
          </GradientText>
        </AntigravityText>

        {/* Animated subtitle */}
        <SplitText className="text-3xl text-gray-300" variant="fadeUp">
          Where Art Meets Innovation
        </SplitText>
      </div>
    </section>
  );
}
```

### Example 2: Animated Section Titles

Add to any section for eye-catching titles:

```jsx
// In any section component
import { GradientText, SplitText } from '../components/ReactBits';

<h2 className="text-6xl font-bold mb-12 text-center">
  <GradientText colors={['#f093fb', '#4facfe']}>
    Our Facilities
  </GradientText>
</h2>

<SplitText className="text-xl text-gray-400 text-center max-w-3xl mx-auto">
  State-of-the-art venues designed for unforgettable experiences
</SplitText>
```

### Example 3: Scroll-Based Parallax Cards

Perfect for feature showcases or gallery items:

```jsx
// src/sections/Facilities.jsx
import { ScrollFloat, ShuffleText } from '../components/ReactBits';

export default function Facilities() {
  const facilities = [
    { title: "Main Stage", description: "..." },
    { title: "Studio A", description: "..." },
    { title: "Gallery Space", description: "..." },
  ];

  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {facilities.map((facility, index) => (
          <ScrollFloat 
            key={index}
            offset={80}
            direction={index % 2 === 0 ? 'up' : 'down'}
            speed={0.4}
          >
            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
              <ShuffleText className="text-3xl font-bold mb-4">
                {facility.title}
              </ShuffleText>
              <p className="text-gray-400">{facility.description}</p>
            </div>
          </ScrollFloat>
        ))}
      </div>
    </section>
  );
}
```

### Example 4: Typewriter Loading State

Great for intro sequences or loading screens:

```jsx
import { useState, useEffect } from 'react';
import { TextType } from '../components/ReactBits';

export default function LoadingIntro() {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {!showContent ? (
        <TextType 
          className="text-4xl font-mono"
          speed={60}
          onComplete={() => setShowContent(true)}
        >
          Initializing MEDAI experience...
        </TextType>
      ) : (
        <div>{/* Your main content */}</div>
      )}
    </div>
  );
}
```

### Example 5: Floating Navigation Menu

Add a persistent bubble menu to your app:

```jsx
// In App.jsx or a layout component
import { BubbleMenu } from './components/ReactBits';

const menuItems = [
  { 
    icon: '🏠', 
    label: 'Home', 
    onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) 
  },
  { 
    icon: '🎭', 
    label: 'Venues', 
    onClick: () => document.getElementById('venues')?.scrollIntoView({ behavior: 'smooth' }) 
  },
  { 
    icon: '🎨', 
    label: 'Gallery', 
    onClick: () => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }) 
  },
  { 
    icon: '📧', 
    label: 'Contact', 
    onClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) 
  },
];

// Add to your App component
<BubbleMenu 
  items={menuItems}
  bubbleColor="rgba(102, 126, 234, 0.9)"
  position="bottom-right"
  mainIcon="✨"
/>
```

## Advanced Combinations

### Layered Background Effects

Create depth with multiple background layers:

```jsx
<section className="relative min-h-screen">
  {/* Layer 1: Dark base */}
  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black" />
  
  {/* Layer 2: Animated veil */}
  <DarkVeil 
    colors={['#1a1a2e', '#16213e', '#0f3460']} 
    opacity={0.5} 
  />
  
  {/* Layer 3: Light rays */}
  <LightRays 
    color="#ffffff" 
    opacity={0.08} 
    rayCount={20} 
    speed={25} 
  />
  
  {/* Content */}
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</section>
```

### Nested Animations

Combine multiple text effects:

```jsx
<div className="text-center">
  <AntigravityText className="text-7xl font-bold mb-6">
    <GradientText 
      colors={['#667eea', '#764ba2', '#f093fb']}
      animationDuration={4}
    >
      <SplitText animateBy="character" variant="scale">
        MEDAI
      </SplitText>
    </GradientText>
  </AntigravityText>
</div>
```

### Scroll-Triggered Sections

Create engaging scroll experiences:

```jsx
const features = [
  { title: "Feature 1", description: "..." },
  { title: "Feature 2", description: "..." },
  { title: "Feature 3", description: "..." },
];

return (
  <section className="space-y-32 py-20">
    {features.map((feature, index) => (
      <ScrollFloat 
        key={index}
        offset={100}
        direction={index % 2 === 0 ? 'left' : 'right'}
        speed={0.5}
      >
        <div className="flex items-center gap-12">
          <div className="flex-1">
            <ShuffleText className="text-5xl font-bold mb-4">
              {feature.title}
            </ShuffleText>
            <SplitText 
              className="text-xl text-gray-400"
              variant="fadeUp"
              animateBy="word"
            >
              {feature.description}
            </SplitText>
          </div>
          <div className="flex-1">
            {/* Image or visual */}
          </div>
        </div>
      </ScrollFloat>
    ))}
  </section>
);
```

## Performance Tips

1. **Lazy load components** - Only render animations when in viewport
2. **Limit simultaneous animations** - Too many can cause jank
3. **Use `useMemo` for menu items** - Prevent unnecessary re-renders
4. **Reduce ray count on mobile** - Better performance on lower-end devices

```jsx
import { useMemo } from 'react';

const menuItems = useMemo(() => [
  { icon: '🏠', label: 'Home', onClick: handleHome },
  // ...
], []);

// Responsive ray count
const rayCount = window.innerWidth < 768 ? 8 : 16;
```

## Accessibility Considerations

1. **Respect prefers-reduced-motion**:

```jsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<AntigravityText 
  duration={prefersReducedMotion ? 0 : 1.2}
>
  Text
</AntigravityText>
```

2. **Ensure text remains readable** during animations
3. **Provide alternative navigation** alongside BubbleMenu
4. **Test keyboard navigation** for interactive components

## Testing Your Integration

1. **View the demo page**:
   ```jsx
   import ReactBitsDemo from './components/ReactBitsDemo';
   // Temporarily render <ReactBitsDemo /> to see all components
   ```

2. **Start your dev server**:
   ```bash
   npm run dev
   ```

3. **Check browser console** for any errors
4. **Test on different screen sizes**
5. **Verify smooth scrolling** with Lenis

---

Happy animating! 🎨✨
