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
                                TALK.
                            </motion.span>
                        </h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="text-2xl md:text-3xl text-white/70 max-w-sm leading-tight font-black italic"
                        >
                            Ready to take the stage? Connect with our team to book your curation.
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
                            <div>
                                <span className="text-[11px] md:text-xs font-black tracking-[0.5em] block mb-6 text-[#A78BFA] opacity-80 uppercase">Locations</span>
                                <ul className="space-y-4 font-black text-xs tracking-widest text-white/60">
                                    {['CHENNAI - ALWARPET', 'BENGALURU - KORAMANGALA', 'COIMBATORE - RACE COURSE'].map((loc, i) => (
                                        <motion.li
                                            key={i}
                                            whileHover={{ x: 5, color: '#A78BFA' }}
                                            className="transition-colors cursor-default"
                                        >
                                            {loc}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <span className="text-[11px] md:text-xs font-black tracking-[0.5em] block mb-6 text-[#A78BFA] opacity-80 uppercase">Social</span>
                                <ul className="space-y-4">
                                    {['Instagram', 'Facebook', 'LinkedIn'].map((social, i) => (
                                        <motion.li key={social} whileHover={{ x: 5 }}>
                                            <a href="#" className="text-[11px] font-black tracking-[0.4em] uppercase text-[#A78BFA] opacity-60 hover:opacity-100 hover:text-white transition-all inline-block underline-offset-8 decoration-[#A78BFA]/20 hover:decoration-white/50">
                                                {social}
                                            </a>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="space-y-12 flex flex-col justify-between"
                        >
                            <motion.div
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.4 }}
                            >
                                <span className="text-[11px] md:text-xs font-black tracking-[0.5em] block mb-6 text-[#A78BFA] opacity-80 uppercase">Direct</span>
                                <p className="font-black text-xl md:text-2xl mb-1 tracking-tighter hover:text-[#A78BFA] transition-colors cursor-pointer text-white">hello@medai.in</p>
                                <p className="text-[#A78BFA] opacity-60 text-sm italic tracking-widest font-bold">+91 98765 43210</p>
                            </motion.div>
                            <div className="pt-8">
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "#A78BFA", color: "#000", borderColor: "#A78BFA" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full py-6 border border-[#A78BFA]/30 bg-[#A78BFA]/5 text-white transition-all duration-700 text-xs tracking-[0.6em] uppercase font-black rounded-full shadow-3xl"
                                >
                                    Join Artist Network
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="pt-12 border-t border-[#A78BFA]/20 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] tracking-[0.5em] uppercase font-black text-[#A78BFA] opacity-60 text-center md:text-left"
                >
                    <div>© 2026 MEDAI PERFORMANCE SPACES</div>
                    <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                        {['Privacy', 'Technical Rider', 'Terms'].map(link => (
                            <span key={link} className="hover:text-white cursor-pointer transition-colors underline-offset-4 decoration-[#A78BFA]/20">{link}</span>
                        ))}
                    </div>
                    <div className="opacity-80 italic text-[#A78BFA]/40">Crafted for Excellence</div>
                </motion.div>
            </div>
        </footer>
    )
}
