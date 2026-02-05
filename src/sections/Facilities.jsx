import { motion } from 'framer-motion'

export default function Facilities({ scrollProgress }) {
    const facilities = [
        { title: "Stage Lighting", desc: "LED profiles, PARs, washes, moving heads" },
        { title: "Audio Architecture", desc: "Sound support & treated halls" },
        { title: "Adaptable Stage", desc: "Flexible setups for performance needs" },
        { title: "Visual Projection", desc: "High-resolution LED screens" },
        { title: "Artist Ecosystem", desc: "Green room, backstage & rehearsal" },
        { title: "Technical Support", desc: "FOH console & assistance" }
    ]

    return (
        <section className="relative w-full py-20 md:py-[30vh] section-container overflow-visible">
            {/* Background Heading - Optimized for Mobile visibility */}
            <div className="absolute left-[5vw] top-1/2 -translate-y-1/2 pointer-events-none select-none z-0 hidden md:block">
                <h2 className="text-[15vw] font-black leading-[0.8] tracking-tighter uppercase">
                    <span className="text-white opacity-[0.04]">BUILT</span><br />
                    <span className="text-white opacity-[0.02]">FOR</span><br />
                    <span className="text-white opacity-[0.04]">EXCELLENCE</span>
                </h2>
            </div>

            <div className="grid grid-cols-12 gap-10 md:gap-12 lg:gap-24 items-center relative z-10">
                {/* Left Side: Summary Text */}
                <div className="col-span-12 lg:col-span-5">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <span className="text-[10px] md:text-meta block mb-8 md:mb-12">04 / Infrastructure</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-8 md:mb-12 tracking-tighter uppercase leading-[0.9]">Technical <br /><span className="italic opacity-40">Superiority.</span></h2>
                        <div className="h-[1px] w-20 bg-white/20 mb-8 md:mb-12" />
                        <p className="text-base md:text-xl text-secondary leading-relaxed font-light max-w-sm italic">
                            Engineered to meet the highest professional standards of performing arts production.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: Feature Cards */}
                <div className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                    {facilities.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="group glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between h-full border border-white/5"
                        >
                            <div className="mb-6 md:mb-10 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                <span className="text-[10px] font-bold opacity-30 tracking-tighter">0{i + 1}</span>
                            </div>
                            <div>
                                <h4 className="text-lg md:text-xl font-black mb-2 md:mb-4 tracking-tighter uppercase leading-none">{item.title}</h4>
                                <p className="text-xs md:text-sm text-secondary font-light leading-relaxed opacity-60">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
