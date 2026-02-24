import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import FacilityCore from '../components/FacilityCore'

export default function Facilities() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const bgY = useTransform(scrollYProgress, [0, 1], [100, -100])
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.04, 0])

    const facilities = [
        { title: "Stage Lighting", desc: "LED profiles, PARs, washes & moving heads" },
        { title: "Sound Support", desc: "High-quality audio for theatre, music & dance" },
        { title: "Flexible Stage", desc: "Adaptable configuration for any performance" },
        { title: "Visual Projection", desc: "LED screens & projection support" },
        { title: "Acoustic Halls", desc: "Acoustically treated for superior fidelity" },
        { title: "Artist Facilities", desc: "Green room, backstage & changing facilities" },
        { title: "FOH Console", desc: "Onsite technical assistance available" },
        { title: "Rehearsal Add-ons", desc: "Rehearsal space available upon request" }
    ]

    return (
        <section ref={containerRef} className="relative w-full pt-16 pb-12 md:py-24 border-t border-[#A78BFA]/5 overflow-hidden flex flex-col items-center bg-[#030303]">
            {/* Background Heading - Cinematic Parallax */}
            <motion.div
                style={{ y: bgY, opacity: bgOpacity }}
                className="absolute left-[5vw] top-1/2 pointer-events-none select-none z-0 hidden lg:block"
            >
                <h2 className="text-[15vw] font-black leading-[0.8] tracking-tighter uppercase text-white/5">
                    BUILT<br />
                    FOR<br />
                    EXCELLENCE
                </h2>
            </motion.div>

            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-16 lg:gap-24 items-center relative z-10 w-full max-w-7xl px-4 md:px-16 lg:px-24">
                {/* Left Side: Summary Text */}
                <div className="w-full lg:col-span-5 flex flex-col items-start">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="flex flex-col items-start text-left"
                    >
                        <span className="text-xs md:text-sm font-black tracking-[0.6em] text-[#A78BFA] block mb-8 md:mb-12 uppercase opacity-80">04 / Infrastructure</span>
                        <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-12 tracking-tighter uppercase leading-[0.85] text-white">
                            Fully <br />
                            <span className="italic opacity-40">Equipped.</span>
                        </h2>

                        {/* 3D Facility Core Integration */}
                        <div className="w-full h-[300px] my-12 relative hidden lg:block">
                            <FacilityCore />
                        </div>

                        <div className="h-[2px] w-12 bg-[#A78BFA]/60 mb-12" />
                        <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-black max-w-sm italic">
                            Professional performance infrastructure for every art form.
                        </p>
                    </motion.div>
                </div>

                {/* Right Side: Feature Cards */}
                <div className="w-full lg:col-span-7 flex flex-col sm:grid sm:grid-cols-2 gap-8 items-center mt-12 lg:mt-0">
                    {facilities.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 1, ease: "backOut" }}
                            whileHover={{ y: -8, backgroundColor: "rgba(167, 139, 250, 0.05)" }}
                            className="group glass p-8 md:p-10 rounded-[3rem] flex flex-col justify-between h-full border border-white/5 shadow-3xl transition-all duration-500 w-full relative overflow-hidden backdrop-blur-xl bg-white/[0.01]"
                        >
                            <div className="mb-6 w-14 h-14 rounded-2xl bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center group-hover:bg-[#A78BFA] group-hover:text-black transition-all duration-500">
                                <span className="text-xs font-black text-[#A78BFA] group-hover:text-black tracking-tighter">0{i + 1}</span>
                            </div>
                            <div>
                                <h4 className="text-xl font-black mb-4 tracking-tighter uppercase leading-none group-hover:text-[#A78BFA] origin-left transition-transform text-white">
                                    {item.title}
                                </h4>
                                <p className="text-sm text-white/40 font-medium leading-relaxed italic group-hover:text-white transition-opacity">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
