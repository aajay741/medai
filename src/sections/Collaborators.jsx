import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useGSAP } from '@gsap/react'

export default function Artists() {
    const artists = [
        {
            name: "THEATRE",
            quote: "RAW MOMENTS",
            image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=2070",
            accent: "rgba(255,255,255,0.05)"
        },
        {
            name: "MUSIC",
            quote: "PURE VIBES",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070",
            accent: "rgba(255,255,255,0.08)"
        },
        {
            name: "DANCE",
            quote: "SILENT SOULS",
            image: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?q=80&w=2069",
            accent: "rgba(255,255,255,0.05)"
        },
    ]

    return (
        <section className="min-h-screen py-16 md:py-32 section-container relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-24">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1"
                >
                    <span className="text-xs md:text-sm font-black tracking-[0.6em] text-[#A78BFA] block mb-6 uppercase opacity-80">06 / Collaborators</span>
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-none">The Artist <br /><span className="italic opacity-40 text-white/40">Network.</span></h2>
                </motion.div>

                <div className="flex-1 md:text-right hidden md:block">
                    <p className="text-white/60 max-w-sm ml-auto text-xl leading-relaxed italic font-medium opacity-70">
                        Where creative visionaries meet state-of-the-art black box infrastructure.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-[#A78BFA]/10 border border-[#A78BFA]/15 rounded-[3rem] overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)]">
                {artists.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ backgroundColor: "rgba(167, 139, 250, 0.04)" }}
                        className="group h-[500px] md:h-[700px] p-8 md:p-14 flex flex-col justify-between cursor-pointer transition-all duration-700 relative overflow-hidden"
                    >
                        {/* Background Reveal Logic */}
                        <div className="absolute inset-0 z-0">
                            <motion.img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover opacity-20 grayscale group-hover:scale-110 group-hover:opacity-25 group-hover:grayscale-0 transition-all duration-1000 ease-out"
                            />
                            {item.secondaryImage && (
                                <motion.img
                                    src={item.secondaryImage}
                                    alt={`${item.name} secondary`}
                                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-25 translate-y-10 group-hover:translate-y-0 transition-all duration-1000 ease-out delay-100 pointer-events-none"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/70 to-transparent" />
                            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#030303] to-transparent" />
                        </div>

                        {/* Content Header */}
                        <div className="relative z-10">
                            <motion.div
                                initial={{ x: -10, opacity: 0 }}
                                whileInView={{ x: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                            >
                                <span className="text-[10px] md:text-xs font-black tracking-[0.8em] text-[#A78BFA] opacity-60 block mb-6 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-500 uppercase">
                                    {item.quote}
                                </span>
                                <h3 className="text-5xl md:text-[6vw] lg:text-7xl font-black tracking-tighter transition-all duration-500 text-white uppercase leading-none filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                    {item.name}
                                </h3>
                                <div className="h-[2px] w-12 bg-[#A78BFA]/40 mt-10 group-hover:w-32 group-hover:bg-[#A78BFA] transition-all duration-700" />
                            </motion.div>
                        </div>

                        {/* Bottom Interaction & Metadata */}
                        <div className="relative z-10">
                            <div className="text-[11px] font-black tracking-[0.5em] text-[#A78BFA] opacity-60 group-hover:opacity-100 transition-opacity mb-6 uppercase">MEMBER SINCE 2024</div>
                            <div className="flex items-center gap-6 group-hover:translate-x-4 transition-transform duration-700 ease-out">
                                <motion.div
                                    className="w-14 h-14 rounded-full border border-[#A78BFA]/10 flex items-center justify-center bg-[#A78BFA]/10 group-hover:bg-[#A78BFA] group-hover:text-black transition-all duration-500 shadow-2xl"
                                    whileHover={{ scale: 1.15 }}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </motion.div>
                                <span className="text-[11px] font-black tracking-[0.6em] uppercase text-white/50 group-hover:text-white group-hover:opacity-100 transition-opacity">Explore Portfolio</span>
                            </div>
                        </div>

                        {/* Subtle Corner Graphic */}
                        <div className="absolute bottom-0 right-0 w-40 h-40 border-r border-b border-[#A78BFA]/10 translate-x-20 translate-y-20 rotate-45 group-hover:border-[#A78BFA]/20 transition-colors pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
