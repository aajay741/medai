import { useRef } from 'react'
import NeuralPulse from '../components/NeuralPulse'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function About() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [100, -100])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    return (
        <section ref={containerRef} className="min-h-screen flex items-center justify-center relative py-32 overflow-hidden">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                <motion.div
                    style={{ y, opacity }}
                    className="space-y-8"
                >
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-meta"
                    >
                        01 / Concept
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="heading-medium"
                    >
                        Beyond the <br />Punchline.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg text-secondary leading-relaxed max-w-lg"
                    >
                        MEDAI isn't just a show; it's a sensory marvel. Using real-time generative models and spatial audio, we've crafted an environment where the performance reacts to you.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="pt-8"
                    >
                        <button className="px-8 py-4 border border-white/10 hover:bg-white hover:text-black transition-all duration-500 text-sm uppercase tracking-widest">
                            Experience More
                        </button>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative aspect-square"
                >
                    <NeuralPulse />
                </motion.div>
            </div>
        </section>
    )
}
