import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Card = ({ index, color, title, desc, progress, range, targetScale, imageUrl }) => {
    const container = useRef(null)
    const scale = useTransform(progress, range, [1, targetScale])

    // Simplest opacity logic: Only the last card fades to reveal the next section
    // Previous cards stay at opacity 1; they are naturally covered by the next cards in the stack
    const isLast = index === 3;
    const opacity = isLast
        ? useTransform(progress, [0, 0.92, 0.98, 1], [1, 1, 0, 0])
        : 1;

    return (
        <motion.div
            ref={container}
            style={{ opacity }}
            className="h-screen sticky top-0 flex items-center justify-center p-4 md:p-8 z-10"
        >
            <motion.div
                style={{
                    scale,
                    backgroundColor: color,
                    top: `calc(2vh + ${index * 20}px)`
                }}
                className="relative w-full max-w-[1100px] h-[80vh] md:h-[75vh] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10 glass"
            >
                {/* Content Side */}
                <div className="flex-[1.2] p-8 md:p-14 flex flex-col justify-between z-10">
                    <div>
                        <div className="flex items-center gap-4 mb-6 md:mb-8">
                            <span className="text-[10px] md:text-meta opacity-40">Section 0{index + 1}</span>
                            <div className="h-[1px] w-8 md:w-12 bg-white/20" />
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 uppercase leading-none font-black tracking-tighter">
                            {title}
                        </h2>
                        <p className="max-w-md text-sm md:text-lg text-secondary leading-relaxed font-light italic opacity-80">
                            {desc}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 group cursor-pointer w-fit mt-6 md:mt-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                        <span className="text-[10px] md:text-meta tracking-[0.2em] group-hover:translate-x-2 transition-transform">Explore</span>
                    </div>
                </div>

                {/* Image Side */}
                <div className="flex-1 relative h-full min-h-[30vh] md:min-h-0 overflow-hidden bg-black">
                    <motion.img
                        initial={{ scale: 1.2 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        src={imageUrl}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 md:opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent md:bg-gradient-to-r md:from-[#030303]" />
                </div>
            </motion.div>
        </motion.div>
    )
}

export default function Gallery() {
    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })

    const cards = [
        { title: "Live Theatre", desc: "Soul-stirring performances that bridge the gap between audience and actor. A space where every breath counts.", color: "#080808", imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070" },
        { title: "Indie Music", desc: "Acoustically treated halls designed for clarity and emotional resonance. Experience raw energy.", color: "#0a0a0a", imageUrl: "https://images.unsplash.com/photo-1459749411177-042180ceea72?q=80&w=2070" },
        { title: "Classical Dance", desc: "Preserving heritage through intimate spaces that honor tradition. Precision lighting.", color: "#0c0c0c", imageUrl: "https://images.unsplash.com/photo-1547127796-06bb04e4b315?q=80&w=2070" },
        { title: "Standup Comedy", desc: "The classic blackbox vibe for timing, laughter, and connection. Close proximity.", color: "#0e0e0e", imageUrl: "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=2070" }
    ]

    return (
        <section ref={container} className="relative w-full" style={{ height: `${cards.length * 100 + 40}vh` }}>
            <div className="sticky top-0 h-screen flex flex-col items-center justify-center pointer-events-none z-0 overflow-hidden">
                <motion.div
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 0.02, 0.02, 0]) }}
                    className="text-center"
                >
                    <h2 className="text-[25vw] font-black leading-none tracking-tighter select-none uppercase">Spaces</h2>
                </motion.div>
            </div>

            <div className="relative z-10">
                {cards.map((card, i) => {
                    const targetScale = 1 - ((cards.length - i) * 0.04)
                    const start = i * (1 / cards.length)
                    const end = 1
                    return (
                        <Card
                            key={i}
                            index={i}
                            {...card}
                            progress={scrollYProgress}
                            range={[start, end]}
                            targetScale={targetScale}
                        />
                    )
                })}
            </div>
        </section>
    )
}
