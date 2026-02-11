import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Voices() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const bgY = useTransform(scrollYProgress, [0, 1], [100, -100])
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.05, 0])

    const voices = [
        { name: "Arjun R.", role: "Theatre Director", text: "The acoustic precision at Medai transformed how we approach silent moments in our plays." },
        { name: "Deepa K.", role: "Contemporary Dancer", text: "An intimate black box that feels like it belongs to the artist. The floor is perfect." },
        { name: "Siddharth", role: "Indie Musician", text: "The lighting rig is top-tier. It's the best venue for an intimate live record." },
        { name: "Maya S.", role: "Creative Head", text: "Medai isn't just a venue; it's a partner in the creative process." }
    ]

    return (
        <section ref={containerRef} className="min-h-screen pt-40 pb-20 md:py-32 section-container relative overflow-hidden perspective-1000 border-b border-[#A78BFA]/5 bg-[#030303]">
            {/* Background Watermark - Cinematic Parallax */}
            <motion.div
                style={{ y: bgY, opacity: bgOpacity }}
                className="absolute top-1/4 left-0 w-full flex justify-end pointer-events-none select-none z-0 pr-20"
            >
                <h2 className="text-[25vw] font-black uppercase leading-none text-[#A78BFA] tracking-tighter italic">VOICES</h2>
            </motion.div>

            <div className="relative z-10 mb-12 md:mb-24 flex flex-col items-center md:items-start text-center md:text-left">
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-xs md:text-sm font-black tracking-[0.6em] text-[#A78BFA] block mb-6 uppercase opacity-80"
                >
                    08 / Community
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl font-black uppercase leading-[0.85] tracking-tighter text-white"
                >
                    Voices of <br /><span className="italic opacity-65 text-white/40">The Stage.</span>
                </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {voices.map((voice, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50, rotateX: 10 }}
                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -10, scale: 1.01 }}
                        className="glass p-12 md:p-16 rounded-[4rem] border border-white/5 relative group cursor-default shadow-3xl transition-all duration-700 overflow-hidden bg-white/[0.01]"
                    >
                        {/* Interactive Background Glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-[#A78BFA]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        />

                        {/* Quote Icon Enhancement */}
                        <div className="absolute top-8 right-12 text-9xl font-black text-[#A78BFA] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity select-none duration-700">“</div>

                        <p className="relative z-10 text-xl md:text-3xl text-white font-medium leading-relaxed italic mb-14 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                            {voice.text}
                        </p>

                        <div className="relative z-10 flex items-center gap-6">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.8 }}
                                className="w-16 h-16 rounded-2xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 flex items-center justify-center font-black text-[#A78BFA] text-lg group-hover:bg-[#A78BFA] group-hover:text-black transition-all duration-500 shadow-xl"
                            >
                                {voice.name[0]}
                            </motion.div>
                            <div className="group-hover:translate-x-2 transition-transform duration-500">
                                <h4 className="text-base font-black tracking-widest uppercase mb-1 text-white">{voice.name}</h4>
                                <span className="text-[10px] md:text-xs tracking-[0.5em] text-[#A78BFA] uppercase font-black">{voice.role}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
