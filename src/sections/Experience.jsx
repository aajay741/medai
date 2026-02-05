import { motion } from 'framer-motion'

export default function TheExperience() {
    const moments = [
        { title: "Darkness", text: "The moment before the spotlight, where everything is possible." },
        { title: "Vibration", text: "Feel the frequency of live acoustic performances." },
        { title: "Connection", text: "The thin line between the artist and the observer vanishes." }
    ]

    return (
        <section className="min-h-screen py-[20vh] section-container relative">
            <div className="grid grid-cols-12 gap-12">
                <div className="col-span-12 lg:col-span-6 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span className="text-[10px] md:text-meta block mb-12">05 / The Vibe</span>
                        <h2 className="text-4xl md:text-7xl font-black mb-12 tracking-tighter uppercase leading-[0.85]">
                            Beyond the <br />
                            <span className="opacity-30 italic">Physical.</span>
                        </h2>
                        <p className="text-lg md:text-2xl text-secondary leading-relaxed font-light mb-16 italic">
                            A Medai space is not just a room; it's a living entity that breathes with the performance.
                        </p>
                    </motion.div>
                </div>

                <div className="col-span-12 lg:col-span-6 space-y-4">
                    {moments.map((moment, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 1 }}
                            className="glass p-10 md:p-14 rounded-[3rem] border border-white/5 flex flex-col md:flex-row gap-8 items-start md:items-center"
                        >
                            <div className="text-4xl md:text-5xl font-black opacity-10 tracking-tighter">0{i + 1}</div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-4">{moment.title}</h3>
                                <p className="text-sm md:text-base text-secondary font-light leading-relaxed">{moment.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
