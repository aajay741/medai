import { motion, useSpring, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

const Counter = ({ value }) => {
    const ref = useRef(null)
    const isNumber = !isNaN(parseFloat(value.replace('+', '')))
    const numericValue = isNumber ? parseFloat(value.replace('+', '')) : 0
    const suffix = value.includes('+') ? '+' : ''

    useEffect(() => {
        if (!isNumber) return
        const node = ref.current
        const controls = animate(0, numericValue, {
            duration: 2,
            onUpdate(value) {
                node.textContent = Math.round(value) + suffix
            },
            ease: [0.16, 1, 0.3, 1]
        })
        return () => controls.stop()
    }, [numericValue, isNumber, suffix])

    if (!isNumber) return <span>{value}</span>

    return <span ref={ref}>0</span>
}

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
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="relative group p-10 glass rounded-[2.5rem] flex flex-col items-center text-center overflow-hidden"
                        >
                            {/* Animated Background Pulse */}
                            <motion.div
                                className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"
                                initial={false}
                                whileHover={{ scale: 1.5 }}
                            />

                            <div className="text-6xl md:text-8xl font-black text-white mb-10 group-hover:scale-110 transition-transform duration-700 tracking-tighter relative z-10">
                                <Counter value={stat.value} />
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-4 h-[1px] bg-white opacity-20" />
                                <div className="text-meta opacity-40 tracking-[0.4em] text-[10px] font-bold uppercase transition-all group-hover:opacity-100 group-hover:tracking-[0.6em]">
                                    {stat.label}
                                </div>
                                <div className="w-4 h-[1px] bg-white opacity-20" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Background Decorative Text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none opacity-[0.01] select-none z-0">
                    <div className="text-[30vw] font-black whitespace-nowrap leading-none tracking-tighter uppercase text-center italic">
                        QUANTUM
                    </div>
                </div>
            </div>
        </section>
    )
}
