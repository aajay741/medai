import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function VisualArchive() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const bgX = useTransform(scrollYProgress, [0, 1], [400, -400])

    const segments = [
        { label: 'Cinematography', title: 'Captured <br/> Motion.', date: '2025/26' },
        { label: 'Atmosphere', title: 'Light & <br/> Shadows.', date: 'Archive' },
        { label: 'Infrastructure', title: 'Generative <br/> Voids.', date: 'System' }
    ]

    return (
        <section ref={containerRef} className="relative py-32 px-6 overflow-hidden bg-[#050505]">
            {/* Background Parallax Text */}
            <motion.div
                style={{ x: bgX }}
                className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[30vw] font-black uppercase text-white/[0.01] pointer-events-none select-none z-0"
            >
                VAULT SYSTEM 09-ARCHIVE
            </motion.div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase mb-8 block"
                    >
                        10 / The Vault
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-[8vw] font-black text-white uppercase tracking-tighter leading-none mb-12"
                    >
                        Visual <br />
                        <span className="text-white/20 italic">Archives.</span>
                    </motion.h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                    {segments.map((segment, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -15 }}
                            className="flex-1 bg-white/[0.01] border border-white/5 p-12 rounded-[4rem] group hover:border-[#A78BFA]/30 hover:bg-[#A78BFA]/[0.05] transition-all duration-700 flex flex-col justify-between aspect-[3/4] lg:aspect-[4/5] relative overflow-hidden backdrop-blur-3xl"
                        >
                            {/* Background Number Reveal */}
                            <div className="absolute -bottom-10 -right-10 text-[20rem] font-black text-white/[0.01] group-hover:text-[#A78BFA]/[0.05] transition-colors leading-none pointer-events-none italic">
                                0{i + 1}
                            </div>

                            <div className="relative z-10 flex justify-between items-start">
                                <span className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA] uppercase">{segment.label}</span>
                                <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase">{segment.date}</span>
                            </div>

                            <div className="relative z-10">
                                <h3
                                    className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] group-hover:tracking-[0.1em] transition-all duration-700"
                                    dangerouslySetInnerHTML={{ __html: segment.title }}
                                />
                                <div className="mt-8 overflow-hidden">
                                    <motion.div
                                        whileHover={{ x: 10 }}
                                        className="flex items-center gap-4 text-[#A78BFA] cursor-pointer"
                                    >
                                        <span className="text-[10px] font-black tracking-[0.3em] uppercase">Open Reel</span>
                                        <motion.div
                                            initial={{ width: 40 }}
                                            whileHover={{ width: 80 }}
                                            className="h-[1px] bg-[#A78BFA]/40"
                                        />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Cinematic Gradient Edge */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#A78BFA]/20 to-transparent" />
        </section>
    )
}
