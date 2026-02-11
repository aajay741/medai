import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function CreativeRoadmap() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const pathLength = useTransform(scrollYProgress, [0.2, 0.8], [0, 1])

    const milestones = [
        { quarter: 'Phase 01', title: 'Conceptual Genesis', desc: 'Decoding the architectural limitations of traditional performance.' },
        { quarter: 'Phase 02', title: 'Neural Integration', desc: 'Mapping real-time artist biomics to generative light fields.' },
        { quarter: 'Phase 03', title: 'Spatial Launch', desc: 'Deploying the first 128-channel immersive audio node.' },
        { quarter: 'Phase 04', title: 'Global Sync', desc: 'Interconnecting city-hubs for cross-continental shows.' }
    ]

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-[#050505] overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                <div className="text-center mb-32">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase mb-8 block"
                    >
                        07 / Evolution Cycle
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-4"
                    >
                        Roadmap <br />
                        <span className="text-white/10 italic">2025/26.</span>
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Vertical Progress Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 hidden md:block -translate-x-1/2" />
                    <motion.div
                        style={{ scaleY: pathLength, originY: 0 }}
                        className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#A78BFA] to-transparent hidden md:block -translate-x-1/2 shadow-[0_0_15px_#A78BFA]"
                    />

                    <div className="space-y-48">
                        {milestones.map((ms, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 relative ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                            >
                                <div className="flex-1 text-center md:text-left">
                                    <div className={`space-y-6 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <motion.span
                                            initial={{ opacity: 0, x: i % 2 === 0 ? 20 : -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            className="text-[#A78BFA] font-black tracking-widest text-sm uppercase italic block"
                                        >
                                            {ms.quarter}
                                        </motion.span>
                                        <h3 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter group-hover:text-[#A78BFA] transition-colors">
                                            {ms.title}
                                        </h3>
                                        <p className="text-white/40 text-lg md:text-xl font-medium max-w-lg mx-auto md:mx-0 leading-relaxed italic">
                                            {ms.desc}
                                        </p>
                                    </div>
                                </div>

                                <motion.div
                                    whileHover={{ scale: 1.2, boxShadow: '0 0 30px rgba(167, 139, 250, 0.4)' }}
                                    className="relative z-10 w-24 h-24 rounded-full bg-[#030303] border-2 border-[#A78BFA]/40 flex items-center justify-center shrink-0 shadow-2xl transition-all duration-500"
                                >
                                    <div className="w-5 h-5 rounded-full bg-[#A78BFA] shadow-[0_0_15px_#A78BFA]" />
                                    <div className="absolute inset-0 rounded-full border border-[#A78BFA]/20 animate-ping opacity-20" />
                                </motion.div>

                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Background Texture Enhancement */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[1px] bg-[#A78BFA]/10 rotate-12" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[1px] bg-[#A78BFA]/10 -rotate-12" />
            </div>
        </section>
    )
}
