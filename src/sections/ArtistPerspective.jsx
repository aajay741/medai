import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import GalleryLens from '../components/GalleryLens'

export default function ArtistPerspective() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [50, -50])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-[#030303] overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -50 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative lg:col-span-6"
                    >
                        <motion.div
                            style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
                            className="absolute -inset-24 bg-[#A78BFA]/5 blur-[120px] rounded-full"
                        />
                        <div className="relative aspect-square rounded-[5rem] overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-1000 group">
                            <motion.img
                                src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=2069"
                                initial={{ scale: 1.2 }}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 2 }}
                                className="w-full h-full object-cover opacity-60 transition-transform duration-[2000ms]"
                                alt="Artist POV"
                            />
                            {/* Animated overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-60" />
                        </div>
                    </motion.div>

                    <motion.div
                        style={{ y, opacity }}
                        className="space-y-12 lg:col-span-6"
                    >
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase block mb-8"
                        >
                            09 / Creative Lens
                        </motion.span>
                        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                            Through the <br />
                            <span className="text-white/30 italic">Artist's Eyes.</span>
                        </h2>

                        {/* 3D Lens Integration */}
                        <div className="w-full h-[300px] my-12 relative hidden md:block">
                            <GalleryLens />
                        </div>

                        <p className="text-2xl text-white/70 italic leading-relaxed font-black mb-12">
                            "Every show at MEDAI feels like a dialogue between my art and the space itself. The 3D depth and neural triggers change how I perform."
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center gap-6 group cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full border border-white/10 overflow-hidden group-hover:border-[#A78BFA]/50 transition-colors">
                                <img src="https://i.pravatar.cc/150?u=artist" className="group-hover:scale-110 transition-transform duration-700" alt="Artist Profile" />
                            </div>
                            <div>
                                <h5 className="text-white font-black tracking-widest uppercase group-hover:text-[#A78BFA] transition-colors">Vikram R.</h5>
                                <span className="text-[#A78BFA] text-xs font-black italic opacity-60">Visual Performance Artist</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Background Decorative Floaties */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -right-20 -top-20 w-80 h-80 border border-white/5 rounded-full"
            />
        </section>
    )
}
