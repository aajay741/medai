import MotionText from '../components/MotionText'
import CTAButton from '../components/CTAButton'
import { motion } from 'framer-motion'

export default function FinaleScene() {
    // Confetti particles
    const confetti = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        rotation: Math.random() * 360,
        color: ['#FF3366', '#9333EA', '#FFB800'][Math.floor(Math.random() * 3)]
    }))

    return (
        <section className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
            {/* Confetti animation */}
            <div className="absolute inset-0 pointer-events-none">
                {confetti.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute w-3 h-3 rounded-sm"
                        style={{
                            left: `${particle.x}%`,
                            top: '-10%',
                            backgroundColor: particle.color,
                            rotate: particle.rotation
                        }}
                        animate={{
                            y: ['0vh', '110vh'],
                            rotate: [particle.rotation, particle.rotation + 360],
                            opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                            duration: particle.duration,
                            delay: particle.delay,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            {/* Spotlight flare */}
            <motion.div
                className="absolute inset-0 bg-gradient-radial from-comedy-gold/30 via-transparent to-transparent"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="container mx-auto px-6 z-10 text-center">
                <MotionText variant="scaleIn" delay={0.2}>
                    <h2 className="font-display font-black text-7xl md:text-9xl mb-8 text-white leading-tight">
                        DON'T MISS OUT
                    </h2>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.4}>
                    <p className="text-3xl md:text-5xl font-display gradient-text mb-6">
                        Book Your Seats Now
                    </p>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.5}>
                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join us for an unforgettable night of laughter, joy, and pure entertainment.
                        Seats are filling up fast!
                    </p>
                </MotionText>

                {/* Event details */}
                <MotionText variant="fadeUp" delay={0.6}>
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 max-w-4xl mx-auto mb-12">
                        <div className="grid md:grid-cols-3 gap-8 mb-8">
                            <div>
                                <div className="text-comedy-red text-sm font-display font-bold mb-2 uppercase tracking-wider">
                                    Date
                                </div>
                                <div className="text-2xl font-display font-bold text-white">
                                    March 15-17, 2026
                                </div>
                            </div>

                            <div>
                                <div className="text-comedy-purple text-sm font-display font-bold mb-2 uppercase tracking-wider">
                                    Venue
                                </div>
                                <div className="text-2xl font-display font-bold text-white">
                                    The Comedy Arena
                                </div>
                                <div className="text-gray-400 text-sm">Los Angeles, CA</div>
                            </div>

                            <div>
                                <div className="text-comedy-gold text-sm font-display font-bold mb-2 uppercase tracking-wider">
                                    Tickets From
                                </div>
                                <div className="text-2xl font-display font-bold text-white">
                                    $45
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <CTAButton variant="primary" className="text-xl px-12 py-5">
                                🎟️ Get Tickets
                            </CTAButton>
                            <CTAButton variant="outline" className="text-xl px-12 py-5">
                                📧 Notify Me
                            </CTAButton>
                        </div>
                    </div>
                </MotionText>

                {/* Social proof */}
                <MotionText variant="fadeUp" delay={0.8}>
                    <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-comedy-gold" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>4.9/5 Rating</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-comedy-red" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span>50,000+ Happy Fans</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-comedy-purple" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>100% Verified Reviews</span>
                        </div>
                    </div>
                </MotionText>

                {/* Footer */}
                <MotionText variant="fadeIn" delay={1}>
                    <div className="mt-20 pt-8 border-t border-white/10">
                        <p className="text-gray-500 text-sm">
                            © 2026 Laugh Riot. All rights reserved. | Follow us on social media for updates
                        </p>
                    </div>
                </MotionText>
            </div>

            {/* Intense bottom glow */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-comedy-red/20 via-comedy-purple/10 to-transparent pointer-events-none" />
        </section>
    )
}
