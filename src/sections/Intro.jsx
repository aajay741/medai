import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function Intro({ scrollProgress }) {
    return (
        <section className="min-h-screen py-20 md:py-[20vh] relative section-container">
            <div className="grid grid-cols-12 gap-6 md:gap-12">
                {/* Left Column: Heading */}
                <div className="col-span-12 lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <span className="text-[10px] md:text-meta block mb-8 md:mb-12">01 / The Vision</span>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 md:mb-12 leading-[0.9] tracking-tighter uppercase">
                            A Black Box <br />
                            <span className="opacity-30 italic">Ecosystem.</span>
                        </h2>
                        <div className="max-w-xl space-y-6 md:space-y-8 pb-12">
                            <p className="text-lg md:text-2xl text-secondary leading-relaxed font-light">
                                Medai is an artist-run network of black box spaces, meticulously designed for the <span className="text-white font-medium">unfiltered expression</span> of performing arts.
                            </p>
                            <p className="text-base md:text-xl text-secondary leading-relaxed font-light opacity-60">
                                From Chennai to Bengaluru and Coimbatore, we provide the canvas for theatre, dance, and music to thrive in their purest forms.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Mission Card */}
                <div className="col-span-12 lg:col-span-5 flex flex-col justify-center order-1 lg:order-2 mb-12 lg:mb-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] relative overflow-hidden border border-white/5"
                    >
                        <div className="relative z-10">
                            <span className="text-[10px] md:text-meta block mb-6 opacity-40">Our Mission</span>
                            <p className="text-2xl md:text-3xl font-bold leading-tight italic text-white mb-8">
                                "To bring all art forms under one roof, making Medai truly a Stage for All."
                            </p>
                            <div className="h-[1px] w-full bg-white/10 mb-8" />
                            <div className="flex justify-between items-center text-[9px] md:text-[10px] tracking-[0.3em] font-bold">
                                <span>SINCE 2020</span>
                                <span className="px-3 py-1 border border-white/20 rounded-full">ARTIST RUN</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
