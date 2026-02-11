import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import SystemMatrix from '../components/SystemMatrix'

export default function StageTechnology() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    const specs = [
        { title: 'Spatial Audio', value: '128 Channels', desc: 'Object-based multidimensional soundscapes.' },
        { title: 'Visual Matrix', value: '16K Resolution', desc: 'Seamless generative floor-to-ceiling mapping.' },
        { title: 'Response Node', value: '< 5ms Latency', desc: 'Real-time generative interaction with performer motion.' }
    ]

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-[#030303] overflow-hidden">
            {/* Background decorative text */}
            <motion.div
                style={{ opacity: 0.02, x: useTransform(scrollYProgress, [0, 1], [-200, 200]) }}
                className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[20vw] font-black uppercase pointer-events-none select-none"
            >
                INFRASTRUCTURE SYSTEM MATRIX
            </motion.div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-20">
                    <motion.div
                        style={{ opacity }}
                        className="flex-1 space-y-12"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <span className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase mb-8 block">Neural Infrastructure</span>
                            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                                Stage <br />
                                <span className="text-white/20 italic">Intelligence.</span>
                            </h2>
                        </motion.div>

                        <div className="space-y-4">
                            {specs.map((spec, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    whileHover={{ x: 10, backgroundColor: "rgba(167, 139, 250, 0.05)" }}
                                    className="p-8 border border-white/5 bg-white/[0.02] rounded-[2.5rem] group transition-all cursor-crosshair relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-end mb-4 relative z-10">
                                        <h4 className="text-xl font-black text-white uppercase group-hover:text-[#A78BFA] transition-colors">{spec.title}</h4>
                                        <span className="text-[#A78BFA] font-black text-2xl italic tracking-tighter">{spec.value}</span>
                                    </div>
                                    <p className="text-white/40 group-hover:text-white/70 transition-colors uppercase text-[10px] font-bold tracking-widest relative z-10">{spec.desc}</p>

                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-[#A78BFA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ scale, opacity }}
                        className="flex-1 relative aspect-square hidden lg:block"
                    >
                        <SystemMatrix />

                        {/* Decorative floating bits */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 w-24 h-24 border border-[#A78BFA]/20 rounded-full blur-xl"
                        />
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 w-32 h-32 border border-[#A78BFA]/10 rounded-full blur-2xl"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
