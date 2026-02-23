import { motion } from 'framer-motion'

export default function Footer() {
    return (
        <footer className="relative pt-16 pb-12 px-6 bg-[#030303] z-20 overflow-hidden border-t border-[#A78BFA]/10">
            {/* Cinematic Background Glow */}
            <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-[#A78BFA]/[0.05] blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-24 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <h2 className="text-7xl md:text-9xl font-black mb-12 tracking-[-0.08em] uppercase leading-none text-white overflow-hidden">
                            <motion.span
                                initial={{ y: '100%' }}
                                whileInView={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-block"
                            >
                                MEDAI.
                            </motion.span>
                        </h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="text-2xl md:text-3xl text-white/70 max-w-sm leading-tight font-black italic"
                        >
                            The home for performing arts. Join our network of premium artist-run spaces.
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="space-y-12"
                        >
                            <div className="space-y-10">
                                <span className="text-[11px] md:text-xs font-black tracking-[0.5em] block mb-6 text-[#A78BFA] opacity-80 uppercase">Our Stages</span>

                                {/* Chennai Location */}
                                <div className="space-y-2">
                                    <a href="https://share.google/cJbLUT3vpgCAAewym" target="_blank" rel="noopener noreferrer" className="group">
                                        <h4 className="text-white font-black text-sm tracking-widest group-hover:text-[#A78BFA] transition-colors uppercase">Chennai — Alwarpet</h4>
                                        <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-wider max-w-[250px]">
                                            3rd floor 16, 1st Cross St, Cooperative Colony, Alwarpet, Chennai 600018
                                        </p>
                                    </a>
                                </div>

                                {/* Bangalore Location */}
                                <div className="space-y-2">
                                    <a href="https://share.google/OCOZmpdqdnNOnvK2N" target="_blank" rel="noopener noreferrer" className="group">
                                        <h4 className="text-white font-black text-sm tracking-widest group-hover:text-[#A78BFA] transition-colors uppercase">Bengaluru — Koramangala</h4>
                                        <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-wider max-w-[250px]">
                                            No.15, KHB MIG Colony, 5th Block, Koramangala, Bengaluru 560030
                                        </p>
                                    </a>
                                </div>

                                {/* Coimbatore Location */}
                                <div className="space-y-2">
                                    <a href="https://share.google/t3a7On8VUXVPKvgN7" target="_blank" rel="noopener noreferrer" className="group">
                                        <h4 className="text-white font-black text-sm tracking-widest group-hover:text-[#A78BFA] transition-colors uppercase">Coimbatore — Clusters</h4>
                                        <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-wider max-w-[250px]">
                                            Clusters Media College, Coimbatore
                                        </p>
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="space-y-12 flex flex-col justify-between"
                        >
                            <div>
                                <span className="text-[11px] md:text-xs font-black tracking-[0.5em] block mb-6 text-[#A78BFA] opacity-80 uppercase">Connect</span>
                                <p className="font-black text-xl md:text-2xl mb-1 tracking-tighter hover:text-[#A78BFA] transition-colors cursor-pointer text-white">hello@medai.in</p>
                                <p className="text-[#A78BFA] opacity-60 text-sm italic tracking-widest font-bold">@medai_thestage</p>
                            </div>

                            <div className="space-y-6">
                                <span className="text-[11px] md:text-xs font-black tracking-[0.5em] block text-[#A78BFA] opacity-80 uppercase">Network</span>
                                <div className="flex gap-6 justify-center md:justify-start">
                                    {['Instagram', 'Facebook', 'LinkedIn'].map((social) => (
                                        <a key={social} href="#" className="text-[10px] font-black tracking-widest uppercase text-white/40 hover:text-white transition-colors">{social}</a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] tracking-[0.4em] uppercase font-black text-white/20 text-center md:text-left"
                >
                    <div>© 2026 MEDAI PERFORMANCE SPACES. ALL RIGHTS RESERVED.</div>
                    <div className="flex gap-12">
                        {['Privacy', 'Technical Rider', 'Terms'].map(link => (
                            <span key={link} className="hover:text-white cursor-pointer transition-colors">{link}</span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}
