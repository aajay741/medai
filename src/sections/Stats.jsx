import { motion } from 'framer-motion'

export default function Stats({ scrollProgress }) {
    const stats = [
        { label: "Venues", value: "03" },
        { label: "Shows Hosted", value: "1000+" },
        { label: "Festivals", value: "10+" },
        { label: "Artists", value: "50+" }
    ]

    return (
        <section className="min-h-screen flex items-center justify-center relative pt-[20vh] pb-[40vh] overflow-hidden section-container">
            <div className="w-full relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-32 border-b border-white/10 pb-16">
                    <span className="text-meta">02 / Growth</span>
                    <h2 className="text-lg md:text-xl opacity-40 italic font-light tracking-widest uppercase">The Impact in Numbers.</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 1 }}
                            className="relative group p-10 glass rounded-[2.5rem] flex flex-col items-center text-center"
                        >
                            <div className="text-6xl md:text-8xl font-black text-white mb-10 group-hover:scale-105 transition-transform duration-700 tracking-tighter">
                                {stat.value}
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-[1px] bg-white opacity-20" />
                                <div className="text-meta opacity-40 tracking-[0.4em] text-[10px] font-bold uppercase">
                                    {stat.label}
                                </div>
                                <div className="w-4 h-[1px] bg-white opacity-20" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Background Decorative Text - Reduced Opacity & Centered */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none opacity-[0.01] select-none z-0">
                    <div className="text-[30vw] font-black whitespace-nowrap leading-none tracking-tighter uppercase text-center italic">
                        QUANTUM
                    </div>
                </div>
            </div>
        </section>
    )
}
