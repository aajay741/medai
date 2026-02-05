import { useRef } from 'react'

export default function About({ scrollProgress }) {
    // We can use scrollProgress to tilt or move things if we want, 
    // but for now, we'll keep it clean.

    return (
        <section className="min-h-screen flex items-center justify-center relative py-32">
            <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                    <span className="text-meta">01 / Concept</span>
                    <h2 className="heading-medium">Beyond the <br />Punchline.</h2>
                    <p className="text-lg text-secondary leading-relaxed max-w-lg">
                        Medai isn't just a show; it's a technical marvel. Using real-time generative models and spatial audio, we've crafted an environment where the comedy reacts to you.
                    </p>
                    <div className="pt-8">
                        <button className="px-8 py-4 border border-white/10 hover:bg-white hover:text-black transition-all duration-500 text-sm uppercase tracking-widest">
                            Explore Tech
                        </button>
                    </div>
                </div>

                <div className="relative aspect-square">
                    <div className="absolute inset-0 glass rounded-full opacity-20" />
                    <div className="absolute inset-10 glass rounded-full flex items-center justify-center">
                        <div className="text-6xl font-light opacity-10">AI</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
