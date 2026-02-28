import { motion, animate, useInView } from 'framer-motion'
import { useEffect, useRef } from 'react'

const Counter = ({ value, duration = 2 }) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })
    const isNumber = !isNaN(parseFloat(value.replace('+', '')))
    const numericValue = isNumber ? parseFloat(value.replace('+', '')) : 0
    const suffix = value.includes('+') ? '+' : ''

    useEffect(() => {
        if (!isNumber || !isInView) return
        const node = ref.current
        const controls = animate(0, numericValue, {
            duration,
            onUpdate(v) {
                node.textContent = Math.round(v) + suffix
            },
            ease: [0.16, 1, 0.3, 1]
        })
        return () => controls.stop()
    }, [numericValue, isNumber, suffix, isInView, duration])

    if (!isNumber) return <span>{value}</span>

    return <span ref={ref}>0</span>
}

export default function Stats({ tier = 2, isMobile = false }) {
    const isLowTier = tier === 0 || isMobile
    const stats = [
        { label: "Shows Hosted", value: "1000+" },
        { label: "Venues", value: "03" },
        { label: "Festivals", value: "10+" },
        { label: "Artists", value: "50+" }
    ]

    return (
        <section className="relative py-20 overflow-hidden section-container bg-[#030303] border-t border-[#A78BFA]/5">
            <div className="w-full relative z-10 container mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={isLowTier ? { opacity: 0 } : { opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * (isLowTier ? 0.03 : 0.05), duration: isLowTier ? 0.6 : 1.2, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={isLowTier ? {} : { y: -8, scale: 1.02 }}
                            className="relative group p-8 md:p-12 glass rounded-[3rem] flex flex-col items-center text-center overflow-hidden border border-white/5 shadow-3xl transition-all duration-700 bg-white/[0.01]"
                        >
                            {/* Hover Glow - Only on mid and high tiers */}
                            {!isLowTier && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#A78BFA]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            )}

                            <div className="text-5xl md:text-7xl font-black text-white mb-6 group-hover:text-[#A78BFA] transition-colors duration-700 tracking-tighter relative z-10">
                                <Counter value={stat.value} duration={isLowTier ? 1 : 2} />
                            </div>

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="h-[2px] w-4 bg-[#A78BFA] opacity-40 group-hover:opacity-100 transition-opacity" />
                                <div className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-[#A78BFA] opacity-80 transition-all group-hover:text-white group-hover:tracking-[0.6em] group-hover:opacity-100">
                                    {stat.label}
                                </div>
                                <div className="h-[2px] w-4 bg-[#A78BFA] opacity-40 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
