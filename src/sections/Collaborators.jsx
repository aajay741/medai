import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useGSAP } from '@gsap/react'

export default function Artists() {
    const artists = [
        {
            name: "THEATRE",
            quote: "RAW MOMENTS",
            image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=2069",
            accent: "rgba(255,255,255,0.05)"
        },
        {
            name: "MUSIC",
            quote: "PURE VIBES",
            image: "https://images.unsplash.com/photo-1514525253344-a8130a43af31?q=80&w=2070",
            accent: "rgba(255,255,255,0.08)"
        },
        {
            name: "DANCE",
            quote: "SILENT SOULS",
            image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069",
            accent: "rgba(255,255,255,0.05)"
        },
    ]

    return (
        <section className="min-h-screen py-32 section-container relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-24">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex-1"
                >
                    <span className="text-meta block mb-6">06 / Collaborators</span>
                    <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-none">The Artist <br /><span className="italic opacity-30">Network.</span></h2>
                </motion.div>

                <div className="flex-1 md:text-right hidden md:block">
                    <p className="text-secondary max-w-sm ml-auto text-lg leading-relaxed italic opacity-40">
                        Where creative visionaries meet state-of-the-art black box infrastructure.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                {artists.map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                        className="group h-[650px] p-12 flex flex-col justify-between cursor-pointer transition-all duration-700 relative overflow-hidden"
                    >
                        {/* Background Content Image - Solid filling of the "empty" space */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover opacity-20 grayscale group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent" />
                            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#030303] to-transparent" />
                        </div>

                        {/* Content Side */}
                        <div className="relative z-10">
                            <span className="text-[10px] font-black tracking-[0.8em] opacity-30 block mb-6 group-hover:opacity-100 transition-opacity">
                                {item.quote}
                            </span>
                            <h3 className="text-5xl md:text-6xl font-black tracking-tighter group-hover:italic transition-all duration-500 text-white">
                                {item.name}
                            </h3>
                            <div className="h-[2px] w-12 bg-white mt-8 group-hover:w-24 transition-all duration-700" />
                        </div>

                        {/* Bottom Interaction */}
                        <div className="relative z-10">
                            <div className="text-[9px] font-bold tracking-[0.4em] opacity-20 group-hover:opacity-60 transition-opacity mb-2">PARTNERSHIP</div>
                            <div className="flex items-center gap-4 group-hover:translate-x-3 transition-transform duration-700">
                                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                                <span className="text-[10px] font-black tracking-[0.5em] uppercase">VIEW CASE</span>
                            </div>
                        </div>

                        {/* Decorative 3D-like Corner Edge */}
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-[0.02] -rotate-45 translate-x-16 translate-y-16 pointer-events-none" />
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
