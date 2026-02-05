import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Voices() {
    const containerRef = useRef()
    const voices = [
        { name: "Arjun R.", role: "Theatre Director", text: "The acoustic precision at Medai transformed how we approach silent moments in our plays." },
        { name: "Deepa K.", role: "Contemporary Dancer", text: "An intimate black box that feels like it belongs to the artist. The floor is perfect." },
        { name: "Siddharth", role: "Indie Musician", text: "The lighting rig is top-tier. It's the best venue for an intimate live record." },
        { name: "Maya S.", role: "Creative Head", text: "Medai isn't just a venue; it's a partner in the creative process." }
    ]

    return (
        <section className="min-h-screen py-32 section-container relative overflow-hidden" ref={containerRef}>
            <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none select-none">
                <h2 className="text-[20vw] font-black uppercase leading-none">VOICES</h2>
            </div>

            <div className="relative z-10 mb-24">
                <span className="text-meta block mb-6">07 / Community</span>
                <h2 className="heading-medium uppercase">Voices of the <br /><span className="italic opacity-30">Stage.</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {voices.map((voice, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9, rotate: i % 2 === 0 ? -2 : 2 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="glass p-12 md:p-16 rounded-[4rem] border border-white/5 relative group cursor-default"
                    >
                        {/* Quote Icon */}
                        <div className="absolute top-10 right-14 text-6xl font-black opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">“</div>

                        <p className="text-xl md:text-2xl text-white font-light leading-relaxed italic mb-12 opacity-80">
                            {voice.text}
                        </p>

                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs">
                                {voice.name[0]}
                            </div>
                            <div>
                                <h4 className="text-sm font-black tracking-widest uppercase">{voice.name}</h4>
                                <span className="text-[10px] tracking-widest opacity-30 uppercase font-bold">{voice.role}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
