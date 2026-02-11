import { motion } from 'framer-motion'

export default function ArtistCollective() {
    const artists = [
        { name: 'Kiran Deep', role: 'Visual Engineer', img: 'https://i.pravatar.cc/150?u=kiran' },
        { name: 'Elena R.', role: 'Acoustic Curator', img: 'https://i.pravatar.cc/150?u=elena' },
        { name: 'Marcus T.', role: 'Performance Artist', img: 'https://i.pravatar.cc/150?u=marcus' },
        { name: 'Sana V.', role: 'Neural Choreographer', img: 'https://i.pravatar.cc/150?u=sana' }
    ]

    return (
        <section className="relative py-32 px-6 bg-[#030303] overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase mb-8 block"
                        >
                            11 / The Collective
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none"
                        >
                            Artist <br />
                            <span className="text-white/20 italic">Nexus.</span>
                        </motion.h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-white/40 text-xl font-medium max-w-xs italic text-right"
                    >
                        Blending physical prowess with digital shadows. Our global collective of curated visionaries.
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {artists.map((artist, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-center group cursor-crosshair"
                        >
                            <div className="aspect-[3/4] rounded-[3rem] md:rounded-[4rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 border border-white/5 mb-8 relative">
                                <motion.img
                                    src={artist.img}
                                    alt={artist.name}
                                    initial={{ scale: 1.2 }}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 1.5 }}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                                {/* Overlay Reveal */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    className="absolute inset-0 bg-[#A78BFA]/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
                                >
                                    <span className="text-[10px] font-black tracking-[0.5em] text-white uppercase rotate-90 whitespace-nowrap">View Profile</span>
                                </motion.div>
                            </div>
                            <h4 className="text-xl font-black text-white uppercase tracking-tighter mb-1 group-hover:text-[#A78BFA] transition-colors">{artist.name}</h4>
                            <span className="text-[#A78BFA] text-[10px] font-black uppercase tracking-widest italic opacity-60 group-hover:opacity-100 transition-opacity">{artist.role}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Ambient Background Glow Enhancement */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.02, 0.05, 0.02]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-[#A78BFA] blur-[150px] rounded-full -z-10"
            />
        </section>
    )
}
