export default function Features({ scrollProgress }) {
    const items = [
        { title: "Generative Humor", desc: "AI that learns what makes your city laugh." },
        { title: "Spatial immersion", desc: "3D audio that places you in the center of the club." },
        { title: "Visual Synthesis", desc: "Real-time visuals mapped to every frequency." }
    ]

    return (
        <section className="min-h-screen flex flex-col justify-center relative py-32 px-6">
            <div className="container mx-auto">
                <span className="text-meta mb-12 block">02 / Features</span>

                <div className="space-y-1">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="group border-t border-white/10 py-12 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-colors px-4 -mx-4 cursor-pointer"
                        >
                            <h3 className="heading-medium text-white/40 group-hover:text-white transition-colors duration-500">
                                {item.title}
                            </h3>
                            <p className="max-w-xs text-secondary mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                    <div className="border-t border-white/10" />
                </div>
            </div>
        </section>
    )
}
