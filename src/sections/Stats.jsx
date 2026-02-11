import { motion, useSpring, useTransform, animate, useScroll, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

const Counter = ({ value }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const isNumber = !isNaN(parseFloat(value.replace('+', '')))
    const numericValue = isNumber ? parseFloat(value.replace('+', '')) : 0
    const suffix = value.includes('+') ? '+' : ''

    useEffect(() => {
        if (!isNumber || !isInView) return
        const node = ref.current
        const controls = animate(0, numericValue, {
            duration: 2,
            onUpdate(v) {
                node.textContent = Math.round(v) + suffix
            },
            ease: [0.16, 1, 0.3, 1]
        })
        return () => controls.stop()
    }, [numericValue, isNumber, suffix, isInView])

    if (!isNumber) return <span>{value}</span>

    return <span ref={ref}>0</span>
}

export default function Stats() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const bgX = useTransform(scrollYProgress, [0, 1], [-200, 200])
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.05, 0])

    const stats = [
        { label: "Venues", value: "03" },
        { label: "Shows Hosted", value: "1000+" },
        { label: "Festivals", value: "10+" },
        { label: "Artists", value: "50+" }
    ]

    return (
        <section ref={containerRef} className="relative pt-24 pb-64 md:py-32 overflow-hidden section-container perspective-1000 bg-[#030303]">
            {/* Background Decorative Text - Parallax */}
            <motion.div
                style={{ x: bgX, opacity: bgOpacity }}
                className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[35vw] font-black uppercase text-[#A78BFA] pointer-events-none select-none z-0 italic"
            >
                QUANTUM GROWTH
            </motion.div>

            <div className="w-full relative z-10 container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-24 md:mb-32 border-b border-white/10 pb-16">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-xs md:text-sm font-black tracking-[0.6em] text-[#A78BFA] uppercase"
                    >
                        02 / Growth
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-xl md:text-2xl italic font-black tracking-widest uppercase text-white/40"
                    >
                        The Impact in Numbers.
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -15, scale: 1.02 }}
                            className="relative group p-12 glass rounded-[4rem] flex flex-col items-center text-center overflow-hidden border border-white/5 shadow-3xl transition-all duration-700 bg-white/[0.01]"
                        >
                            {/* Cinematic Glow on Hover */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-[#A78BFA]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                            />

                            <div className="text-6xl md:text-8xl font-black text-white mb-10 group-hover:text-[#A78BFA] transition-colors duration-700 tracking-tighter relative z-10">
                                <Counter value={stat.value} />
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: 24 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    className="h-[2px] bg-[#A78BFA] opacity-40 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="text-[11px] md:text-xs font-black tracking-[0.4em] uppercase text-[#A78BFA] opacity-80 transition-all group-hover:text-white group-hover:tracking-[0.6em] group-hover:opacity-100">
                                    {stat.label}
                                </div>
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: 24 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    className="h-[2px] bg-[#A78BFA] opacity-40 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
