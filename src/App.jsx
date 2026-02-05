import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import CanvasWrapper from './components/CanvasWrapper'

// Scene components
import Hero from './sections/Hero'
import Intro from './sections/Intro'
import Stats from './sections/Stats'
import Venues from './sections/Venues'
import Facilities from './sections/Facilities'
import Quote from './sections/Quote'
import Gallery from './sections/Gallery'
import Experience from './sections/Experience'
import Contact from './sections/Contact'

export default function App() {
    const [scrollProgress, setScrollProgress] = useState(0)
    const lenisRef = useRef()

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            lerp: 0.05,
        })

        lenisRef.current = lenis

        function raf(time) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        lenis.on('scroll', ({ scroll, limit, progress }) => {
            setScrollProgress(progress)
        })

        return () => {
            lenis.destroy()
        }
    }, [])

    return (
        <main className="relative bg-[#030303]">
            {/* 3D Core - Shared Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <CanvasWrapper scrollProgress={scrollProgress} />
            </div>

            {/* Content Layers */}
            <div className="relative z-10 w-full">
                <Hero />
                <Intro scrollProgress={scrollProgress} />
                <Stats scrollProgress={scrollProgress} />
                <Venues scrollProgress={scrollProgress} />
                <Facilities scrollProgress={scrollProgress} />
                <Experience scrollProgress={scrollProgress} />
                <Quote scrollProgress={scrollProgress} />
                <Gallery scrollProgress={scrollProgress} />
                <Contact />
            </div>

            {/* Persistent Overlay UI */}
            <div className="fixed top-8 left-8 z-50 mix-blend-difference pointer-events-none">
                <span className="text-meta font-bold">MEDAI</span>
            </div>

            <div className="fixed bottom-8 right-8 z-50 mix-blend-difference">
                <div className="flex flex-col items-end gap-4">
                    <span className="text-[10px] tracking-widest opacity-40 uppercase">Scroll Progress</span>
                    <div className="w-1 h-32 bg-white/10 relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 w-full bg-white transition-transform duration-100 ease-out"
                            style={{ height: '100%', transform: `scaleY(${scrollProgress})`, transformOrigin: 'top' }}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
