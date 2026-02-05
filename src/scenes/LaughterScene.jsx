import MotionText from '../components/MotionText'
import { motion } from 'framer-motion'

export default function LaughterScene() {
    // Generate random laugh particles
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        delay: Math.random() * 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0.5 + Math.random() * 1,
        emoji: ['😂', '🤣', '😆', '😄', '😁'][Math.floor(Math.random() * 5)]
    }))

    return (
        <section className="h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated laugh particles */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute text-4xl"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{
                            opacity: [0, 1, 1, 0],
                            scale: [0, particle.scale, particle.scale, 0],
                            y: [0, -50, -100, -150]
                        }}
                        transition={{
                            duration: 3,
                            delay: particle.delay,
                            repeat: Infinity,
                            ease: "easeOut"
                        }}
                    >
                        {particle.emoji}
                    </motion.div>
                ))}
            </div>

            {/* Sound wave visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full border-2 border-comedy-red/30"
                        style={{
                            width: `${(i + 1) * 100}px`,
                            height: `${(i + 1) * 100}px`,
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 z-10 text-center">
                <MotionText variant="scaleIn" delay={0.2}>
                    <h2 className="font-display font-black text-7xl md:text-8xl mb-8 text-white">
                        LAUGHTER
                    </h2>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.4}>
                    <p className="text-3xl md:text-4xl font-display gradient-text mb-12">
                        The Universal Language
                    </p>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.6}>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                            Join hundreds of comedy lovers for an unforgettable night where
                            every punchline lands and every moment is pure joy.
                        </p>
                    </div>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.8}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { value: '98%', label: 'Audience Satisfaction' },
                            { value: '1000+', label: 'Laughs Per Show' },
                            { value: '4.9★', label: 'Average Rating' },
                            { value: '50K+', label: 'Happy Fans' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                                whileHover={{ scale: 1.05, borderColor: 'rgba(255, 51, 102, 0.5)' }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="text-3xl font-display font-bold text-comedy-gold mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </MotionText>
            </div>

            {/* Colorful background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-comedy-purple/20 via-comedy-red/20 to-comedy-gold/20 pointer-events-none blur-3xl" />
        </section>
    )
}
