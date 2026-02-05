import MotionText from '../components/MotionText'
import { motion } from 'framer-motion'

export default function ComedianScene() {
    return (
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
            <div className="container mx-auto px-6 z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Comedian silhouette */}
                    <MotionText variant="scaleIn" delay={0.2}>
                        <div className="relative">
                            {/* Abstract silhouette */}
                            <motion.div
                                className="w-64 h-96 mx-auto relative"
                                animate={{
                                    scale: [1, 1.02, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {/* Head */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-comedy-red to-comedy-purple blur-sm opacity-80" />
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full border-4 border-comedy-gold" />

                                {/* Body */}
                                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-32 h-48 rounded-3xl bg-gradient-to-br from-comedy-purple to-comedy-red blur-sm opacity-80" />
                                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-32 h-48 rounded-3xl border-4 border-comedy-gold" />

                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-comedy-red via-comedy-purple to-comedy-gold opacity-20 blur-3xl animate-pulse-glow" />
                            </motion.div>
                        </div>
                    </MotionText>

                    {/* Right: Text content */}
                    <div>
                        <MotionText variant="fadeUp" delay={0.3}>
                            <h2 className="font-display font-black text-6xl md:text-7xl mb-6 text-white">
                                Meet Your Host
                            </h2>
                        </MotionText>

                        <MotionText variant="fadeUp" delay={0.4}>
                            <h3 className="font-display font-bold text-4xl md:text-5xl mb-6 gradient-text">
                                DAVE "THE RIOT" JOHNSON
                            </h3>
                        </MotionText>

                        <MotionText variant="fadeUp" delay={0.5}>
                            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                                "I don't just tell jokes. I create experiences that'll have you
                                questioning reality... and your abs from laughing so hard."
                            </p>
                        </MotionText>

                        <MotionText variant="fadeUp" delay={0.6}>
                            <div className="flex flex-wrap gap-3 mb-8">
                                <span className="px-4 py-2 bg-comedy-red/20 border border-comedy-red rounded-full text-sm font-display">
                                    Netflix Special
                                </span>
                                <span className="px-4 py-2 bg-comedy-purple/20 border border-comedy-purple rounded-full text-sm font-display">
                                    Emmy Winner
                                </span>
                                <span className="px-4 py-2 bg-comedy-gold/20 border border-comedy-gold rounded-full text-sm font-display">
                                    Sold Out Tours
                                </span>
                            </div>
                        </MotionText>

                        <MotionText variant="fadeUp" delay={0.7}>
                            <blockquote className="border-l-4 border-comedy-red pl-6 italic text-lg text-gray-400">
                                "The funniest human I've ever witnessed. Prepare to cry from laughter."
                                <footer className="text-sm mt-2 text-gray-500">— Comedy Central</footer>
                            </blockquote>
                        </MotionText>
                    </div>
                </div>
            </div>

            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-comedy-purple/10 via-transparent to-comedy-red/10 pointer-events-none" />
        </section>
    )
}
