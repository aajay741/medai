import MotionText from '../components/MotionText'
import CTAButton from '../components/CTAButton'

export default function ArrivalScene() {
    return (
        <section className="h-screen flex items-center justify-center relative">
            <div className="container mx-auto px-6 text-center z-10">
                <MotionText variant="scaleIn" delay={0.2}>
                    <h1 className="font-display font-black text-7xl md:text-9xl mb-6 gradient-text leading-tight">
                        LAUGH RIOT
                    </h1>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.4}>
                    <p className="text-2xl md:text-4xl font-display text-comedy-gold mb-4">
                        The Ultimate Stand-Up Comedy Experience
                    </p>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.6}>
                    <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        March 15, 2026 • The Comedy Arena • Los Angeles
                    </p>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.8}>
                    <CTAButton variant="primary">
                        Book Your Tickets Now
                    </CTAButton>
                </MotionText>

                {/* Scroll indicator */}
                <MotionText variant="fadeIn" delay={1.2}>
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                        <div className="flex flex-col items-center gap-2 animate-bounce">
                            <span className="text-sm text-gray-400 font-body">Scroll to explore</span>
                            <svg
                                className="w-6 h-6 text-comedy-red"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                            </svg>
                        </div>
                    </div>
                </MotionText>
            </div>

            {/* Ambient glow */}
            <div className="absolute inset-0 bg-gradient-radial from-comedy-red/10 via-transparent to-transparent pointer-events-none" />
        </section>
    )
}
