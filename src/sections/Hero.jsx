import { useRef, Suspense, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Canvas } from '@react-three/fiber'
import StageLight from '../components/ThreeD/StageLight'
import Curtain from '../components/ThreeD/Curtain'
import SoundWave from '../components/ThreeD/SoundWave'

const AnimatedTitle = ({ children, className }) => {
    const containerRef = useRef()

    useGSAP(() => {
        if (!containerRef.current) return
        const chars = containerRef.current.querySelectorAll('.char')
        chars.forEach(char => {
            char.addEventListener('mouseenter', () => {
                gsap.to(char, {
                    y: -12,
                    scale: 1.2,
                    color: '#ffffff',
                    duration: 0.5,
                    ease: 'power3.out'
                })
            })
            char.addEventListener('mouseleave', () => {
                gsap.to(char, {
                    y: 0,
                    scale: 1,
                    color: 'rgba(255,255,255,1)',
                    duration: 0.6,
                    ease: 'power2.out'
                })
            })
        })
    }, { scope: containerRef })

    return (
        <h1 ref={containerRef} className={className}>
            {(children || "").split('').map((char, i) => (
                <span key={i} className="char inline-block cursor-pointer px-[2px]">
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h1>
    )
}

export default function Hero({ onBookClick, tier = 2, isMobile: isMobileProp }) {
    const container = useRef(null)
    const isMobile = isMobileProp ?? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isInView = useInView(container, { margin: "200px" })
    const isLowTier = tier === 0
    const isMidTier = tier === 1

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end start"]
    })

    const rotateX = useTransform(scrollYProgress, [0, 0.2], [0, 8])
    const rotateZ = useTransform(scrollYProgress, [0, 0.2], [0, -2])
    const yTranslation = useTransform(scrollYProgress, [0, 0.3], [0, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <section ref={container} className="min-h-[100vh] flex flex-col items-center justify-center relative section-container overflow-hidden perspective-1000 py-24 md:py-40">
            {/* 3D Theatrical Background - Disabled on mobile for performance */}
            {!isMobile && (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                    {isInView && (
                        <Canvas
                            camera={{ position: [0, 0, 30], fov: 50 }}
                            gl={{
                                antialias: tier > 1,
                                powerPreference: 'high-performance',
                                alpha: true
                            }}
                            dpr={isLowTier ? 1 : [1, 1.2]}
                        >
                            <ambientLight intensity={0.3} />
                            <Suspense fallback={null}>
                                <StageLight position={[-15, 8, -10]} color="#FFD700" intensity={isLowTier ? 1 : 1.5} tier={tier} />
                                <StageLight position={[15, 8, -10]} color="#FF69B4" intensity={isLowTier ? 1 : 1.5} tier={tier} />
                                <StageLight position={[0, 12, -15]} color="#A78BFA" intensity={isLowTier ? 1.5 : 2} tier={tier} />
                                <Curtain position={[0, 0, -20]} open={false} tier={tier} />
                                {!isLowTier && <SoundWave position={[0, -5, -5]} color="#A78BFA" tier={tier} />}
                            </Suspense>
                        </Canvas>
                    )}
                </div>
            )}

            {/* Ambient Purple Depth Layer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-[#A78BFA]/[0.03] blur-[160px] rounded-full pointer-events-none z-0" />


            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    y: yTranslation,
                    opacity,
                    transformStyle: 'preserve-3d'
                }}
                className="text-center z-20 w-full px-6 md:px-12 flex flex-col items-center justify-center"
            >

                <div className="relative w-full max-w-full flex justify-center mx-auto mt-12 md:mt-32">
                    <AnimatedTitle className="text-[22vw] md:text-[24vw] font-black leading-[0.7] md:leading-[0.65] tracking-[-0.06em] uppercase text-white select-none filter drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] text-center w-full whitespace-nowrap">
                        MEDAI
                    </AnimatedTitle>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12 md:mt-20 w-full flex flex-col items-center"
                >
                    <p className="text-xl md:text-2xl text-white/60 uppercase tracking-[0.2em] md:tracking-[0.5em] leading-[1.6] md:leading-[2] font-medium text-center max-w-[90%] md:max-w-[70%] mx-auto">
                        Black box spaces for contemporary performing arts
                    </p>

                    <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-6">
                        <button
                            onClick={() => onBookClick()}
                            className="bg-[#A78BFA] text-black px-10 py-5 md:px-12 md:py-5 rounded-full text-xs md:text-xs font-black tracking-[0.4em] md:tracking-[0.6em] uppercase hover:bg-white hover:scale-105 transition-all duration-500 shadow-3xl pointer-events-auto"
                        >
                            Check Availability
                        </button>
                        <button
                            onClick={() => scrollToSection('venues')}
                            className="border border-white/20 text-white px-10 py-5 md:px-12 md:py-5 rounded-full text-xs md:text-xs font-black tracking-[0.4em] md:tracking-[0.6em] uppercase hover:border-[#A78BFA] hover:text-[#A78BFA] hover:scale-105 transition-all duration-500 pointer-events-auto"
                        >
                            Explore Venues
                        </button>
                    </div>

                    <div className="mt-20 md:mt-32 flex flex-wrap items-center justify-center gap-8 md:gap-24 opacity-60 px-4">
                        {["CHENNAI", "BENGALURU", "COIMBATORE"].map((city, i) => (
                            <motion.div
                                key={city}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1, scale: 1.05 }}
                                transition={{ duration: 0.5, delay: 1.5 + (i * 0.1) }}
                                className="flex items-center gap-3 md:gap-4 text-[11px] md:text-sm tracking-[0.4em] md:tracking-[0.7em] font-black cursor-pointer group transition-all"
                            >
                                <div className="w-[1.5px] md:w-[2px] h-3 md:h-4 bg-[#A78BFA]/40 group-hover:bg-[#A78BFA] transition-colors" />
                                <span className="text-[#A78BFA]/70 group-hover:text-white transition-colors">{city}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Cinematic Frame */}
            <motion.div
                className="absolute inset-6 md:inset-16 border border-white/[0.03] pointer-events-none rounded-[4rem] z-10"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.5, ease: "circOut" }}
            />
        </section>
    )
}
