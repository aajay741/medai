import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const AnimatedTitle = ({ children, className }) => {
    const containerRef = useRef()

    useGSAP(() => {
        if (!containerRef.current) return
        const chars = containerRef.current.querySelectorAll('.char')
        chars.forEach(char => {
            char.addEventListener('mouseenter', () => {
                gsap.to(char, {
                    y: -20,
                    scale: 1.3,
                    color: '#ffffff',
                    duration: 0.4,
                    ease: 'power3.out'
                })
            })
            char.addEventListener('mouseleave', () => {
                gsap.to(char, {
                    y: 0,
                    scale: 1,
                    color: 'rgba(255,255,255,0.9)',
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.3)'
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

export default function Hero() {
    const container = useRef(null)
    const { scrollYProgress } = useScroll() // Use global scroll for the fade-out

    // Fade out as the page scrolls down
    const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
    const y = useTransform(scrollYProgress, [0, 0.1], [0, -100])

    return (
        <section ref={container} className="h-screen flex items-center justify-center relative section-container overflow-hidden">
            <motion.div style={{ opacity, y }} className="text-center z-20 w-full px-4">
                <div className="overflow-hidden mb-6">
                    <motion.span
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: 'circOut' }}
                        className="text-[10px] md:text-meta block font-bold text-white/40 tracking-[0.8em]"
                    >
                        AN ARTIST-RUN COLLECTIVE
                    </motion.span>
                </div>

                <AnimatedTitle className="text-7xl md:text-[14vw] font-black leading-[0.75] tracking-tighter uppercase text-white/90">
                    MEDAI
                </AnimatedTitle>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-12 md:mt-16 max-w-2xl mx-auto"
                >
                    <p className="text-sm md:text-2xl text-secondary uppercase tracking-[0.4em] leading-tight font-light italic">
                        Expanding the <br className="md:hidden" />
                        <span className="text-white font-black not-italic tracking-[0.6em]">Senses</span>
                    </p>

                    <div className="mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-14">
                        {["Chennai", "Bengaluru", "Coimbatore"].map((city, i) => (
                            <motion.div
                                key={city}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 0.4, y: 0 }}
                                whileHover={{ opacity: 1, scale: 1.1, y: -2 }}
                                transition={{ duration: 0.3, delay: 1 + (i * 0.1) }}
                                className="flex items-center gap-4 text-[10px] tracking-[0.5em] font-black cursor-pointer"
                            >
                                <span>{city}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Decorative Border */}
            <motion.div
                className="absolute inset-8 md:inset-12 border border-white/[0.05] pointer-events-none rounded-[3rem] z-10"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2 }}
            />
        </section>
    )
}
