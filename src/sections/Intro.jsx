import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Intro() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [50, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    return (
        <section ref={containerRef} className="py-12 md:py-32 relative section-container overflow-hidden bg-[#030303]">
            <div className="grid grid-cols-12 gap-6 md:gap-12 relative z-10">
                {/* Left Column: Heading */}
                <motion.div
                    style={{ y, opacity }}
                    className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1"
                >
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-xs md:text-sm font-black tracking-[0.6em] text-[#A78BFA] block mb-8 md:mb-12 uppercase opacity-80"
                    >
                        01 / The Vision
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl lg:text-8xl font-black mb-8 md:mb-12 leading-[0.85] tracking-tighter uppercase text-white"
                    >
                        A Black Box <br />
                        <span className="opacity-40 italic">Ecosystem.</span>
                    </motion.h2>
                    <div className="max-w-xl space-y-6 md:space-y-8 pb-12">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-3xl text-white leading-relaxed font-medium italic opacity-90"
                        >
                            Medai is an artist-run network of black box spaces, meticulously designed for the <span className="text-[#A78BFA] font-black">unfiltered expression</span> of performing arts.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-base md:text-xl text-white/50 leading-relaxed font-medium"
                        >
                            From Chennai to Bengaluru and Coimbatore, we provide the canvas for theatre, dance, and music to thrive in their purest forms.
                        </motion.p>
                    </div>
                </motion.div>

                {/* Right Column: Mission Card */}
                <div className="col-span-12 lg:col-span-5 flex flex-col justify-center order-1 lg:order-2 mb-12 lg:mb-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ y: -10 }}
                        className="glass p-8 md:p-14 rounded-[4rem] relative overflow-hidden border border-white/5 shadow-3xl transition-all duration-700 bg-white/[0.01]"
                    >
                        {/* Interactive Background Glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-[#A78BFA]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        />

                        <div className="relative z-10">
                            <span className="text-[11px] md:text-sm font-black tracking-[0.5em] block mb-8 text-[#A78BFA] uppercase">The Mission</span>
                            <p className="text-2xl md:text-3xl font-black leading-tight italic text-white mb-10 tracking-tighter">
                                "To bring all art forms under one roof, making Medai truly a Stage for All."
                            </p>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: 60 }}
                                transition={{ duration: 1, delay: 0.8 }}
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

            {/* Background Decorative Floaties */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 90, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-[40vw] h-[40vw] border border-white/5 rounded-full pointer-events-none"
            />
        </section>
    )
}
