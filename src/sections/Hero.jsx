import { useRef, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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

export default function Hero({ onBookClick }) {
    const container = useRef(null)
    const { scrollYProgress } = useScroll()

    const rotateX = useTransform(scrollYProgress, [0, 0.2], [0, 8])
    const rotateZ = useTransform(scrollYProgress, [0, 0.2], [0, -2])
    const yTranslation = useTransform(scrollYProgress, [0, 0.3], [0, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

    return (
        <section ref={container} className="min-h-[100vh] flex flex-col items-center justify-center relative section-container overflow-hidden perspective-1000 py-24 md:py-40">
            {/* 3D Theatrical Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
                <Canvas camera={{ position: [0, 0, 30], fov: 50 }}>
                    <ambientLight intensity={0.3} />
                    <Suspense fallback={null}>
                        <StageLight position={[-15, 8, -10]} color="#FFD700" intensity={1.5} />
                        <StageLight position={[15, 8, -10]} color="#FF69B4" intensity={1.5} />
                        <StageLight position={[0, 12, -15]} color="#A78BFA" intensity={2} />
                        <Curtain position={[0, 0, -20]} open={false} />
                        <SoundWave position={[0, -5, -5]} color="#A78BFA" />
                    </Suspense>
                </Canvas>
            </div>

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
                <div className="overflow-hidden mb-16 md:mb-20">
                    <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1.2, ease: 'circOut' }}
                        className="text-[10px] md:text-meta block font-bold text-[#A78BFA]/90 tracking-[0.8em] md:tracking-[1.2em] uppercase text-center w-full"
                    >
                        An Artist-Run Performance Network
                    </motion.span>
                </div>

                <div className="relative w-full max-w-[98vw] flex justify-center mx-auto">
                    <AnimatedTitle className="text-[15vw] md:text-[22vw] font-black leading-[0.65] tracking-[-0.06em] uppercase text-white select-none filter drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] text-center w-full">
                        MEDAI
                    </AnimatedTitle>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-24 md:mt-36 w-full flex flex-col items-center"
                >
                    <p className="text-sm md:text-3xl text-white/70 uppercase tracking-[0.4em] md:tracking-[0.6em] leading-[1.8] font-medium italic text-center max-w-[80%] mx-auto w-full flex flex-col items-center">
                        <span>Expanding the <span className="text-white font-bold not-italic tracking-[0.6em] md:tracking-[1em] ml-2 md:ml-4">SENSES</span> </span>
                    </p>

                    <button
                        onClick={onBookClick}
                        className="mt-12 md:mt-16 bg-[#A78BFA] text-black px-8 py-4 md:px-12 md:py-5 rounded-full text-[10px] md:text-xs font-black tracking-[0.4em] md:tracking-[0.6em] uppercase hover:bg-white hover:scale-105 transition-all duration-500 shadow-3xl pointer-events-auto"
                    >
                        Secure Your Seat
                    </button>

                    <div className="mt-16 md:mt-32 flex flex-wrap items-center justify-center gap-6 md:gap-24 opacity-60 px-4">
                        {["CHENNAI", "BENGALURU", "COIMBATORE"].map((city, i) => (
                            <motion.div
                                key={city}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1, scale: 1.05 }}
                                transition={{ duration: 0.5, delay: 1.5 + (i * 0.1) }}
                                className="flex items-center gap-3 md:gap-4 text-[9px] md:text-sm tracking-[0.4em] md:tracking-[0.7em] font-black cursor-pointer group transition-all"
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
