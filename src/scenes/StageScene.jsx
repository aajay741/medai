import MotionText from '../components/MotionText'

export default function StageScene() {
    return (
        <section className="h-screen flex items-center justify-center relative">
            <div className="container mx-auto px-6 z-10">
                <div className="max-w-4xl mx-auto">
                    <MotionText variant="fadeUp" delay={0.2}>
                        <h2 className="font-display font-bold text-6xl md:text-7xl mb-6 text-white">
                            The Stage Awaits
                        </h2>
                    </MotionText>

                    <MotionText variant="fadeUp" delay={0.4}>
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8">
                            Step into the spotlight where legends are made. Every joke, every punchline,
                            every moment of pure comedic genius happens right here.
                        </p>
                    </MotionText>

                    <MotionText variant="fadeUp" delay={0.6}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-comedy-red/50 transition-all duration-300 hover:transform hover:scale-105">
                                <div className="text-4xl font-display font-bold text-comedy-red mb-2">500+</div>
                                <div className="text-gray-400">Seats Available</div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-comedy-purple/50 transition-all duration-300 hover:transform hover:scale-105">
                                <div className="text-4xl font-display font-bold text-comedy-purple mb-2">3hrs</div>
                                <div className="text-gray-400">Non-Stop Laughter</div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-comedy-gold/50 transition-all duration-300 hover:transform hover:scale-105">
                                <div className="text-4xl font-display font-bold text-comedy-gold mb-2">5</div>
                                <div className="text-gray-400">World-Class Acts</div>
                            </div>
                        </div>
                    </MotionText>
                </div>
            </div>

            {/* Stage floor effect */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-900/20 to-transparent pointer-events-none" />
        </section>
    )
}
