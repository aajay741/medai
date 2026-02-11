import { motion } from 'framer-motion'
import NetworkEcosystem from '../components/NetworkEcosystem'

export default function Ecosystem() {
    const nodes = [
        { title: 'Curators', desc: 'The architects of experience, handpicking talent for every stage.' },
        { title: 'Performers', desc: 'Visionaries across music, dance, and stand-up comedy.' },
        { title: 'Venues', desc: 'Premium architectural spaces optimized for acoustic depth.' },
        { title: 'Engineers', desc: 'The creative minds behind our spatial and neural infrastructure.' }
    ]

    return (
        <section className="relative py-32 px-6 overflow-hidden bg-[#030303]">
            <div className="container mx-auto max-w-7xl relative z-10">
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase mb-8 block"
                        >
                            12 / The Connection Engine
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-12"
                        >
                            Ecosystem <br />
                            <span className="text-white/30 italic">Dynamics.</span>
                        </motion.h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {nodes.map((node, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 1 }}
                                    className="p-8 border border-white/5 bg-white/[0.02] rounded-[3rem] hover:bg-[#A78BFA]/5 transition-all group"
                                >
                                    <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter group-hover:text-[#A78BFA] transition-colors">
                                        {node.title}
                                    </h3>
                                    <p className="text-sm text-white/40 italic leading-relaxed group-hover:text-white/70 transition-colors">
                                        {node.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] hidden md:block"
                    >
                        <NetworkEcosystem />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </div>

            {/* Background Decorative Floaties */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] opacity-[0.02] pointer-events-none select-none -z-10">
                <div className="w-full h-full border-[100px] border-white rounded-full blur-[120px]" />
            </div>
        </section>
    )
}
