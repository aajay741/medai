import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function ShowProcess() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [50, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    const steps = [
        { title: 'Curation', desc: 'Handpicking talent that aligns with the venue acoustic profile.' },
        { title: 'Ensemble Sync', desc: 'Calibrating spatial audio and generative visuals for the set.' },
        { title: 'The Performance', desc: 'Real-time interaction between artist, system, and audience.' }
    ]

    return (
        <section ref={containerRef} className="relative py-32 px-6 overflow-hidden bg-[#050505] flex flex-col items-center">
            {/* Cinematic Background Parallax */}
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]), opacity: 0.05 }}
                className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-0"
            >
                <div className="absolute top-[20%] left-[10%] text-[20vw] font-black uppercase text-white leading-none">PROCESS</div>
            </motion.div>

            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-24 relative">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase mb-8 block"
                    >
                        06 / The Workflow
                    </motion.span>
                    <motion.h2
                        style={{ y, opacity }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-[8vw] font-black text-white uppercase tracking-tighter leading-none"
                    >
                        Blueprint of <br />
                        <span className="text-white/30 italic">An Experience.</span>
                    </motion.h2>
                </div>

                <div className="relative flex flex-col md:flex-row gap-8 items-stretch">
                    {/* Background Progress Line */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 hidden md:block" />
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                        className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-transparent via-[#A78BFA]/40 to-transparent hidden md:block"
                    />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -10 }}
                            className="flex-1 glass p-12 rounded-[4rem] border border-white/5 flex flex-col items-center text-center relative group overflow-hidden bg-[#030303]/40 backdrop-blur-xl transition-all duration-500"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="text-9xl font-black italic">{i + 1}</span>
                            </div>
                            <motion.div
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                className="w-24 h-24 rounded-3xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 flex items-center justify-center mb-10 group-hover:bg-[#A78BFA] group-hover:text-black transition-all duration-700 shadow-2xl relative z-10"
                            >
                                <span className="text-2xl font-black italic">S-0{i + 1}</span>
                            </motion.div>
                            <h3 className="text-3xl font-black text-white uppercase mb-6 tracking-tighter group-hover:text-[#A78BFA] transition-colors relative z-10">{step.title}</h3>
                            <p className="text-white/50 italic leading-relaxed max-w-xs group-hover:text-white/80 transition-colors relative z-10">{step.desc}</p>

                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-[#A78BFA]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
