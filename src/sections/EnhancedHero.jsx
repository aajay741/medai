import {
    AntigravityText,
    SplitText,
    GradientText,
    ScrollFloat,
    LightRays,
    DarkVeil
} from '../components/ReactBits';

/**
 * Example: Enhanced Hero Section using React Bits components
 * This shows how to integrate React Bits animations into your existing MEDAI project
 */
export default function EnhancedHero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <DarkVeil
                colors={['#030303', '#0a0a0a', '#1a1a2e']}
                opacity={0.6}
            />
            <LightRays
                color="#667eea"
                opacity={0.05}
                rayCount={16}
                speed={30}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                {/* Main Title with Antigravity Effect */}
                <AntigravityText
                    className="text-7xl md:text-9xl font-bold mb-8"
                    delay={0.3}
                    duration={1.8}
                    floatDistance={-40}
                    stagger={0.1}
                >
                    <GradientText
                        colors={['#667eea', '#764ba2', '#f093fb', '#4facfe']}
                        animationDuration={5}
                    >
                        MEDAI
                    </GradientText>
                </AntigravityText>

                {/* Subtitle with Split Text Animation */}
                <div className="mb-12">
                    <SplitText
                        className="text-2xl md:text-4xl text-gray-300 font-light"
                        delay={1.5}
                        duration={0.04}
                        variant="fadeUp"
                        animateBy="character"
                    >
                        Where Art Meets Innovation
                    </SplitText>
                </div>

                {/* Description */}
                <ScrollFloat offset={60} direction="up" speed={0.3}>
                    <div className="max-w-2xl mx-auto">
                        <SplitText
                            className="text-lg text-gray-400"
                            delay={2}
                            duration={0.08}
                            variant="fadeIn"
                            animateBy="word"
                        >
                            Experience the future of artistic expression through cutting-edge systems and immersive performances
                        </SplitText>
                    </div>
                </ScrollFloat>

                {/* CTA Buttons */}
                <ScrollFloat offset={50} direction="up" speed={0.4}>
                    <div className="flex gap-6 justify-center mt-12">
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-lg hover:scale-105 transition-transform">
                            Explore Now
                        </button>
                        <button className="px-8 py-4 border-2 border-white/20 rounded-full font-semibold text-lg hover:bg-white/10 transition-colors">
                            Learn More
                        </button>
                    </div>
                </ScrollFloat>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <ScrollFloat offset={30} direction="down" speed={0.5}>
                    <div className="flex flex-col items-center gap-2 text-white/40">
                        <span className="text-xs uppercase tracking-widest">Scroll</span>
                        <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
                    </div>
                </ScrollFloat>
            </div>
        </section>
    );
}
