import { useEffect, useRef, useState, useMemo } from 'react'
import Lenis from 'lenis'
import { Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'

import CanvasWrapper from './components/CanvasWrapper'
import Booking from './pages/Booking'
import Header from './components/Header'
import CustomCursor from './components/CustomCursor'
import GlobalSpotlights from './components/GlobalSpotlights'

// Page components
import Home from './pages/Home'
import NetworkPage from './pages/NetworkPage'
import SpacesPage from './pages/SpacesPage'
import ExperiencePage from './pages/ExperiencePage'
import GalleryPage from './pages/GalleryPage'
import ContactPage from './pages/ContactPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminEvents from './pages/AdminEvents'
import AdminGallery from './pages/AdminGallery'
import LocationsPage from './pages/LocationsPage'

export default function App() {
    const location = useLocation()
    const scrollProgressRef = useRef(0)
    const scrollIndicatorRef = useRef(null)
    const lenisRef = useRef()

    // 3D Synchronization State
    const baseProgressRef = useRef(0)
    const localProgressRef = useRef(0)

    // VIEW STATE: Handle booking page overlay
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [initialLocation, setInitialLocation] = useState('')

    const handleOpenBooking = (location = '') => {
        setInitialLocation(location)
        setIsBookingOpen(true)
    }

    // Mapping of routes to 3D stages
    const routeConfig = useMemo(() => ({
        '/': { base: 0, weight: 1 / 12 },
        '/network': { base: 1 / 12, weight: 2 / 12 },
        '/spaces': { base: 3 / 12, weight: 2 / 12 },
        '/experience': { base: 5 / 12, weight: 4 / 12 },
        '/gallery': { base: 9 / 12, weight: 1 / 12 },
        '/contact': { base: 10 / 12, weight: 2 / 12 },
        '/locations': { base: 3 / 12, weight: 2 / 12 }
    }), [])

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            lerp: 0.05,
            touchMultiplier: 1.5,
            infinite: false,
        })

        lenisRef.current = lenis

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        lenis.on('scroll', ({ progress }) => {
            localProgressRef.current = progress

            // Calculate absolute progress for 3D scene
            const config = routeConfig[location.pathname] || routeConfig['/']
            const absoluteProgress = baseProgressRef.current + (progress * config.weight)
            scrollProgressRef.current = absoluteProgress

            // Update scroll indicator directly via DOM
            if (scrollIndicatorRef.current) {
                scrollIndicatorRef.current.style.transform = `scaleY(${progress})`
            }
        })

        return () => {
            lenis.destroy()
        }
    }, [location.pathname, routeConfig])

    // Handle smooth transition between 3D stages on route change
    useEffect(() => {
        const config = routeConfig[location.pathname] || routeConfig['/']

        // Animate baseProgress to the new target
        gsap.to(baseProgressRef, {
            current: config.base,
            duration: 2,
            ease: "expo.out",
            onUpdate: () => {
                // Update scrollProgressRef to reflect the ongoing transition
                scrollProgressRef.current = baseProgressRef.current + (localProgressRef.current * config.weight)
            }
        })

        // Scroll to top on route change
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true })
        }
    }, [location.pathname, routeConfig])

    // Global Scroll to Top Listener
    useEffect(() => {
        const handleScrollToTop = () => {
            if (lenisRef.current) {
                lenisRef.current.scrollTo(0, { immediate: true })
            } else {
                window.scrollTo(0, 0)
            }
        }
        window.addEventListener('scroll-to-top', handleScrollToTop)
        return () => window.removeEventListener('scroll-to-top', handleScrollToTop)
    }, [])

    return (
        <main className="relative bg-[#030303]">
            <CustomCursor />

            {/* noise overlay */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] grayscale transition-opacity bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* 3D Core - Shared Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <CanvasWrapper scrollProgressRef={scrollProgressRef} />
            </div>

            {/* Global Spotlights - Follow Scroll on All Pages */}
            <GlobalSpotlights />

            {/* Persistent Branded Header */}
            <Header onBookClick={() => handleOpenBooking()} />

            {/* Multi-Page Routes */}
            <div className="relative z-10 w-full">
                <Routes location={location}>
                    <Route path="/" element={<Home onBookClick={handleOpenBooking} />} />
                    <Route path="/network" element={<NetworkPage />} />
                    <Route path="/spaces" element={<SpacesPage onBookClick={handleOpenBooking} />} />
                    <Route path="/experience" element={<ExperiencePage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/events" element={<AdminEvents />} />
                    <Route path="/admin/gallery" element={<AdminGallery />} />
                    <Route path="/locations" element={<LocationsPage onBookClick={handleOpenBooking} />} />
                </Routes>
            </div>

            {/* Booking Walkthrough Overlay */}
            <Booking
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                initialLocation={initialLocation}
            />

            {/* Scroll Progress Indicator */}
            <div className="fixed bottom-12 right-8 md:right-12 z-50">
                <div className="flex flex-col items-end gap-10 group pointer-events-none select-none">
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] tracking-[0.6em] text-[#A78BFA] font-black uppercase rotate-90 origin-right translate-x-3 opacity-60">Progress</span>
                        <div className="w-[4px] h-48 bg-[#A78BFA]/5 relative overflow-hidden rounded-full border border-[#A78BFA]/10 backdrop-blur-sm shadow-2xl">
                            <div
                                ref={scrollIndicatorRef}
                                className="absolute top-0 left-0 w-full bg-[#A78BFA] shadow-[0_0_20px_rgba(167,139,250,0.5)] will-change-transform"
                                style={{ height: '100%', transform: 'scaleY(0)', transformOrigin: 'top' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
