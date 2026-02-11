import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import ExperienceOrb from '../components/ExperienceOrb'

export default function TheExperience() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const bgX = useTransform(scrollYProgress, [0, 1], [0, -400])

    const moments = [
        { title: "Darkness", text: "The moment before the spotlight, where everything is possible." },
        { title: "Vibration", text: "Feel the frequency of live acoustic performances." },
        { title: "Connection", text: "The thin line between the artist and the observer vanishes." }
    ]

    return (
        <section ref={containerRef} className="min-h-screen py-24 md:py-[20vh] px-4 md:px-16 lg:px-24 relative overflow-hidden flex flex-col items-center bg-[#030303]">
            {/* Cinematic Parallax Text */}
            <motion.div
                style={{ x: bgX }}
                className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[25vw] font-black uppercase text-white/[0.02] pointer-events-none select-none z-0"
            >
                THE MEDAI EXPERIENCE SYSTEM
            </motion.div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10 w-full max-w-7xl">
                <div className="w-full lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center lg:items-start"
                    >
                        <span className="text-xs md:text-sm font-black tracking-[0.6em] text-[#A78BFA] block mb-12 uppercase opacity-80">05 / The Vibe</span>
                        <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-12 tracking-tighter uppercase leading-[0.85] text-white">
                            Beyond the <br />
                            <span className="opacity-40 italic text-white/40">Physical.</span>
                        </h2>

                        {/* 3D Orb Visual Integration */}
                        <div className="w-full h-[400px] mb-12 relative hidden lg:block">
                            <ExperienceOrb />
                        </div>

                        <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-black italic mb-16 opacity-80">
                            A Medai space is not just a room; it's a living entity that breathes with the performance.
                        </p>
                    </motion.div>
                </div>

                <div className="w-full lg:col-span-6 flex flex-col items-center gap-8 mt-12 lg:mt-0">
                    {moments.map((moment, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ scale: 1.02 }}
                            className="group glass p-10 md:p-14 rounded-[4rem] border border-white/5 flex flex-col md:flex-row gap-10 items-center shadow-3xl transition-all duration-700 hover:bg-[#A78BFA]/[0.05] hover:border-[#A78BFA]/20 w-full relative overflow-hidden backdrop-blur-xl bg-white/[0.01]"
                        >
                            <div className="text-5xl md:text-6xl font-black text-[#A78BFA] opacity-20 tracking-tighter transition-opacity italic leading-none group-hover:opacity-60">0{i + 1}</div>
                            <div className="space-y-4 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white group-hover:text-[#A78BFA] transition-colors">{moment.title}</h3>
                                <p className="text-base md:text-lg text-white/40 font-medium leading-relaxed max-w-sm italic group-hover:text-white transition-all">{moment.text}</p>
                            </div>

                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-[#A78BFA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
