import { motion } from 'framer-motion'

export default function BookingBenefits() {
    const benefits = [
        { title: 'Priority Access', desc: 'Secure the best dates for your tour before public release.' },
        { title: 'Stage Spec Support', desc: 'Full assistance in setting up complex audio-visual requirements.' },
        { title: 'Marketing Reach', desc: 'Leverage our 100k+ artist network for show promotions.' }
    ]

    return (
        <section className="relative py-32 px-6 bg-[#080808] overflow-hidden">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase mb-8 block"
                        >
                            Exclusive Benefits
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-12"
                        >
                            Why Host <br />
                            <span className="text-white/30 italic">With Medai?</span>
                        </motion.h2>
                        <div className="space-y-8">
                            {benefits.map((b, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex gap-8 group"
                                >
                                    <div className="w-12 h-12 rounded-full border border-[#A78BFA]/30 flex items-center justify-center shrink-0 group-hover:bg-[#A78BFA] group-hover:text-black transition-all duration-500">
                                        <span className="text-xs font-black italic">0{i + 1}</span>
                                    </div>
                                    <div className="group-hover:translate-x-4 transition-transform duration-500">
                                        <h4 className="text-xl font-black text-white uppercase mb-2 group-hover:text-[#A78BFA] transition-colors">{b.title}</h4>
                                        <p className="text-white/50 italic leading-relaxed group-hover:text-white transition-colors">{b.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 bg-[#A78BFA]/10 blur-3xl rounded-[4rem] group-hover:bg-[#A78BFA]/20 transition-all duration-1000" />
                        <div className="relative glass p-4 rounded-[4rem] border border-white/5 aspect-video overflow-hidden">
                            <motion.img
                                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070"
                                initial={{ scale: 1.2 }}
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 2 }}
                                className="w-full h-full object-cover rounded-[3rem] opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000"
                                alt="Event Hosting"
                            />
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -left-6 px-6 py-2 bg-[#A78BFA] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl z-20"
                        >
                            Premium Support
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
