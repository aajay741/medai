# 🚀 SETUP GUIDE - LAUGH RIOT

## Quick Start (Windows)

### Option 1: Using Batch Files (Easiest)

1. **Double-click `install.bat`** to install all dependencies
2. **Double-click `start.bat`** to start the development server
3. Open your browser to `http://localhost:3000`

### Option 2: Using Command Line

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

## 📦 Dependencies Installation

If you encounter network issues during installation, try:

```bash
# Clear npm cache
npm cache clean --force

# Install with different registry
npm install --registry=https://registry.npmjs.org/

# Or use yarn instead
yarn install
```

## 🔧 Troubleshooting

### PowerShell Execution Policy Error

If you see "running scripts is disabled", run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Network/Proxy Issues

If behind a corporate proxy:

```bash
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

### Port Already in Use

If port 3000 is busy, the dev server will automatically use the next available port (3001, 3002, etc.)

## 🎯 What Gets Installed

The project uses these main packages:

- **react** & **react-dom** - UI framework
- **@react-three/fiber** - React Three.js renderer
- **@react-three/drei** - R3F helpers
- **@react-three/postprocessing** - Visual effects
- **three** - 3D graphics
- **framer-motion** - Animations
- **gsap** - Advanced animations
- **@studio-freight/lenis** - Smooth scrolling
- **tailwindcss** - Styling
- **vite** - Build tool

Total install size: ~500MB

## 🌐 Development Server

Once running, you'll see:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

The page will auto-reload when you make changes!

## 🏗️ Building for Production

```bash
# Create optimized production build
npm run build

# Preview the production build
npm run preview
```

Build output goes to the `dist/` folder.

## 📱 Testing

### Desktop Testing
- Chrome/Edge (recommended)
- Firefox
- Safari

### Mobile Testing
- Use Chrome DevTools device emulation
- Or access via network: `http://[your-ip]:3000`

## ⚡ Performance Tips

For best performance during development:

1. **Close other browser tabs** - WebGL is resource-intensive
2. **Use Chrome** - Best WebGL performance
3. **Disable browser extensions** - Some can interfere with WebGL
4. **Update graphics drivers** - Ensures smooth 3D rendering

## 🎨 Customization Quick Start

### Change Colors
Edit `tailwind.config.js`:
```js
'comedy-red': '#YOUR_COLOR',
```

### Adjust Particle Count
Edit `src/components/ParticleSystem.jsx`:
```js
const particleCount = 1000 // Lower for better performance
```

### Modify Scene Timing
Edit `src/components/CameraRig.jsx`:
```js
{ start: 0, end: 0.14, ... } // Adjust scroll breakpoints
```

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review component files - they're heavily commented
- Test in Chrome DevTools for debugging

## ✅ Verification Checklist

After installation, verify:

- [ ] `node_modules/` folder exists
- [ ] No errors in terminal
- [ ] Dev server starts successfully
- [ ] Browser opens to localhost:3000
- [ ] You see the "LAUGH RIOT" homepage
- [ ] Scrolling works smoothly
- [ ] 3D elements are visible

---

**Ready to build something amazing!** 🎭✨
