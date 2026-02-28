import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Intro({ onBookClick, tier = 2, isMobile = false }) {
    const containerRef = useRef(null)
    const isLowTier = tier === 0 || isMobile
    const isMidTier = tier === 1 && !isMobile

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], isLowTier ? [0, 0] : [50, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    return (
        <section id="about" ref={containerRef} className="pt-20 pb-12 md:py-32 relative section-container overflow-hidden bg-[#030303]">
            <div className="grid grid-cols-12 gap-6 md:gap-12 relative z-10">
                {/* Left Column: Heading */}
                <motion.div
                    style={isLowTier ? { opacity } : { y, opacity }}
                    className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
                >
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: isLowTier ? 0.6 : 1 }}
                        className="text-xs md:text-sm font-black tracking-[0.6em] text-[#A78BFA] block mb-8 md:mb-12 uppercase opacity-80"
                    >
                        01 / The Stage
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: isLowTier ? 10 : 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: isLowTier ? 0.6 : 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 md:mb-12 leading-[0.85] tracking-tighter uppercase text-white"
                    >
                        Artist-Run <br />
                        <span className="opacity-40 italic">Spaces.</span>
                    </motion.h2>
                    <div className="max-w-xl space-y-6 md:space-y-8 pb-12">
                        <motion.p
                            initial={{ opacity: 0, y: isLowTier ? 10 : 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: isLowTier ? 0.05 : 0.2 }}
                            className="text-lg md:text-2xl text-white leading-relaxed font-medium italic opacity-90"
                        >
                            Medai is a fully equipped, artist-run black box performance space located in <span className="text-[#A78BFA] font-black">Chennai, Bengaluru and Coimbatore.</span>
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: isLowTier ? 10 : 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: isLowTier ? 0.1 : 0.4 }}
                            className="text-base md:text-xl text-white/50 leading-relaxed font-medium"
                        >
                            Designed for live performing arts — theatre, dance, music, stand-up comedy, traditional arts, contemporary and experimental works.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: isLowTier ? 10 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: isLowTier ? 0.15 : 0.6 }}
                        className="flex flex-wrap gap-4"
                    >
                        <button
                            onClick={() => document.getElementById('venues')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-[#A78BFA] text-black rounded-full text-[10px] font-black tracking-[0.6em] uppercase hover:bg-white hover:scale-105 transition-all duration-500 shadow-3xl"
                        >
                            Explore Our Venues
                        </button>
                        <button
                            onClick={() => onBookClick()}
                            className="px-8 py-4 border border-[#A78BFA]/30 text-white rounded-full text-[10px] font-black tracking-[0.6em] uppercase hover:border-[#A78BFA] hover:text-[#A78BFA] transition-all duration-500"
                        >
                            Book a Slot
                        </button>
                    </motion.div>
                </motion.div>

                {/* Right Column: Mission Card */}
                <div className="col-span-12 lg:col-span-5 flex flex-col justify-center order-1 lg:order-2 mt-12 md:mt-0 mb-12 lg:mb-0">
                    <motion.div
                        initial={{ opacity: 0, scale: isLowTier ? 1 : 0.8, rotate: isLowTier ? 0 : 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: isLowTier ? 0.8 : 1.5, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={isLowTier ? {} : { y: -10 }}
                        className="glass p-8 md:p-14 rounded-[4rem] relative overflow-hidden border border-white/5 shadow-3xl transition-all duration-700 bg-white/[0.01]"
                    >
                        {/* Interactive Background Glow - Only on mid and high tiers */}
                        {!isLowTier && (
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-[#A78BFA]/10 via-transparent to-transparent"
                            />
                        )}

                        <div className="relative z-10">
                            <span className="text-[11px] md:text-sm font-black tracking-[0.5em] block mb-8 text-[#A78BFA] uppercase">Our Mission</span>
                            <p className="text-2xl md:text-3xl font-black leading-tight italic text-white mb-10 tracking-tighter">
                                "To bring all art forms under one roof, making Medai truly a Stage for All."
                            </p>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: 60 }}
                                transition={{ duration: 1, delay: isLowTier ? 0.2 : 0.8 }}
                                className="h-[2px] bg-[#A78BFA]/40 mb-10"
                            />
                            <div className="flex justify-between items-center text-[11px] tracking-[0.4em] font-black">
                                <span className="text-[#A78BFA] opacity-70 uppercase">EST. 2020</span>
                                <span className="px-5 py-2 border border-[#A78BFA]/20 rounded-full bg-[#A78BFA]/10 text-[#A78BFA] shadow-xl">ARTIST RUN</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Decorative Floaties - Only on High Tier */}
            {tier > 1 && !isMobile && (
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -right-20 w-[40vw] h-[40vw] border border-white/5 rounded-full pointer-events-none"
                />
            )}
        </section>
    )
}
