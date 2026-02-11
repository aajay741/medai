# 🎭 LAUGH RIOT - Cinematic 3D Comedy Show Website

An award-winning, scroll-driven WebGL experience for a stand-up comedy show. Built with React, Three.js, and cutting-edge web technologies.

## ✨ Features

- **Scroll-Driven 3D Experience**: Cinematic camera movements controlled by scroll
- **7 Unique Scenes**: Each with distinct lighting, backgrounds, and animations
- **Advanced WebGL**: Particle systems, dynamic lighting, and post-processing effects
- **Smooth Scrolling**: Powered by Lenis for buttery-smooth interactions
- **Premium Animations**: Framer Motion for UI and 3D mesh transforms
- **GSAP Camera Paths**: Smooth camera transitions between scenes
- **Custom GLSL Shaders**: Dynamic gradient backgrounds
- **Post-Processing**: Bloom, Vignette, and Noise effects
- **Responsive Design**: Desktop-first with mobile fallbacks

## 🎬 Scene Breakdown

1. **Arrival** - Dark theatre with floating particles and hero headline
2. **Stage** - Spotlight on microphone with circling camera
3. **Comedian** - Abstract silhouette with biographical content
4. **Laughter** - Explosive particle effects and sound waves
5. **Details** - Floating 3D cards with show information
6. **Gallery** - Interactive image grid with hover effects
7. **Finale** - Confetti animation with intense CTAs

## 🛠️ Tech Stack

- **React** (Vite)
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/postprocessing** - Post-processing effects
- **Three.js** - 3D graphics library
- **Framer Motion** - UI animations
- **Framer Motion 3D** - 3D mesh animations
- **GSAP** - Camera and timeline animations
- **Lenis** - Smooth scrolling
- **Tailwind CSS** - Utility-first styling
- **GLSL Shaders** - Custom visual effects

## 🎨 React Bits Components

**NEW!** Premium animated UI components inspired by [React Bits](https://reactbits.dev)

This project now includes 9 custom-built animated components:

- **Text Animations**: AntigravityText, SplitText, TextType, ShuffleText, GradientText
- **Scroll Effects**: ScrollFloat (parallax)
- **Navigation**: BubbleMenu (floating menu)
- **Backgrounds**: DarkVeil, LightRays

### Quick Start with React Bits

```jsx
import { AntigravityText, GradientText, SplitText } from './components/ReactBits';

<AntigravityText className="text-6xl font-bold">
  <GradientText colors={['#667eea', '#764ba2']}>
    Your Title
  </GradientText>
</AntigravityText>
```

### Documentation

- 📖 **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 3 steps
- 📖 **[REACTBITS_GUIDE.md](./REACTBITS_GUIDE.md)** - Complete API documentation
- 📖 **[INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)** - Real-world usage patterns
- 📖 **[REACTBITS_SUMMARY.md](./REACTBITS_SUMMARY.md)** - Overview of all components
- 📖 **[VISUAL_GUIDE.txt](./VISUAL_GUIDE.txt)** - Visual component reference

### Demo

View all components in action:
```jsx
import ReactBitsDemo from './components/ReactBitsDemo';
// Temporarily render <ReactBitsDemo /> to see all components
```

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start dev server (runs on port 3000)
npm run dev
```

### Build

```bash
# Create production build
npm run build
```

### Preview

```bash
# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── CanvasWrapper.jsx      # Main 3D canvas with post-processing
│   ├── CameraRig.jsx          # Scroll-controlled camera system
│   ├── StageLights.jsx        # Dynamic lighting system
│   ├── ParticleSystem.jsx     # 2000-particle animation system
│   ├── MicModel.jsx           # 3D microphone model
│   ├── SceneBackground.jsx    # GLSL shader backgrounds
│   ├── MotionText.jsx         # Animated text component
│   ├── CTAButton.jsx          # Premium button component
│   ├── ReactBitsDemo.jsx      # Demo page for React Bits components
│   └── ReactBits/             # 🆕 Premium animated components
│       ├── AntigravityText.jsx
│       ├── SplitText.jsx
│       ├── TextType.jsx
│       ├── ShuffleText.jsx
│       ├── GradientText.jsx
│       ├── ScrollFloat.jsx
│       ├── BubbleMenu.jsx
│       ├── DarkVeil.jsx
│       ├── LightRays.jsx
│       └── index.js
├── scenes/
│   ├── ArrivalScene.jsx       # Scene 1: Hero section
│   ├── StageScene.jsx         # Scene 2: Stage introduction
│   ├── ComedianScene.jsx      # Scene 3: Comedian profile
│   ├── LaughterScene.jsx      # Scene 4: Laughter visualization
│   ├── DetailsScene.jsx       # Scene 5: Show details
│   ├── GalleryScene.jsx       # Scene 6: Photo gallery
│   └── FinaleScene.jsx        # Scene 7: Final CTA
├── sections/
│   └── EnhancedHero.jsx       # 🆕 Example React Bits integration
├── App.jsx                    # Main app with Lenis integration
├── main.jsx                   # React entry point
└── index.css                  # Global styles & animations
```

## 🎨 Design Philosophy

- **Cinematic**: Every scroll feels like a camera movement in a film
- **Energetic**: Constant motion and dynamic lighting
- **Premium**: Glassmorphism, gradients, and smooth animations
- **Funny but Sophisticated**: Playful without being childish
- **Live Performance Feel**: Like walking through a comedy show

## 🎯 Performance Optimizations

- Low-poly 3D geometry
- Instanced particle rendering
- Efficient shader materials
- Optimized post-processing
- Lazy loading and code splitting
- Mobile-responsive with reduced effects

## 🎭 Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:

```js
colors: {
  'comedy-red': '#FF3366',
  'comedy-purple': '#9333EA',
  'comedy-gold': '#FFB800',
  'stage-dark': '#0A0A0A',
}
```

### Scene Timing

Adjust scroll breakpoints in `CameraRig.jsx`:

```js
const scenes = [
  { start: 0, end: 0.14, position: [0, 2, 15], lookAt: [0, 0, 0] },
  // ... more scenes
]
```

### Particle Count

Modify particle density in `ParticleSystem.jsx`:

```js
const particleCount = 2000 // Adjust for performance
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

WebGL 2.0 required for optimal experience.

## 🏆 Inspiration

- Awwwards Site of the Day winners
- RESN interactive experiences
- Apple product storytelling
- Pioneer Corn Revolution

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Credits

Built with ❤️ by an award-winning creative frontend engineer.

---

**Ready to make people laugh?** 🎤✨
