import { motion } from 'framer-motion'

export default function Venues({ scrollProgress }) {
    const venues = [
        {
            city: "CHENNAI",
            capacity: "120 Seater",
            type: "Intimate black box",
            description: "Theatre, classical dance, contemporary acts, indie music, stand-up",
            image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=2070"
        },
        {
            city: "BENGALURU",
            capacity: "170 Seater",
            type: "Flexible mid-scale",
            description: "Festivals, comedy, concerts, indie bands, experimental showcases",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070"
        },
        {
            city: "COIMBATORE",
            capacity: "220 Seater",
            type: "Spacious modern venue",
            description: "Large dance shows, theatre, cultural programs, live music concerts",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070"
        }
    ]

    return (
        <section className="relative w-full py-20 md:py-[20vh] section-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 border-b border-white/5 pb-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <span className="text-[10px] md:text-meta block mb-4 md:mb-6">03 / The Network</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Locations.</h2>
                </motion.div>
                <div className="max-w-xs md:text-right mt-4 md:mt-0">
                    <p className="text-secondary text-xs md:text-sm italic font-light opacity-60 leading-relaxed">
                        Artist-run spaces designed to provide a cohesive ecosystem for the arts.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 xl:gap-12">
                {venues.map((venue, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="group relative h-[400px] md:h-[480px] w-full md:max-w-[360px] mx-auto rounded-[2rem] md:rounded-[2.5rem] overflow-hidden glass border border-white/5 shadow-2xl"
                    >
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 z-0 bg-black">
                            <img src={venue.image} className="w-full h-full object-cover opacity-25 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={venue.city} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-95" />
                        </div>

                        {/* Content Container */}
                        <div className="relative z-10 h-full p-8 md:p-10 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tighter leading-none">MEDAI <br />{venue.city}</h3>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    <span className="text-[7px] tracking-[0.4em] opacity-40 uppercase font-black">Online</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[9px] uppercase tracking-[0.2em] opacity-40 mb-1.5 font-bold italic">capacity</div>
                                        <div className="text-xs font-bold">{venue.capacity}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] uppercase tracking-[0.2em] opacity-40 mb-1.5 font-bold italic">format</div>
                                        <div className="text-xs font-bold">{venue.type}</div>
                                    </div>
                                </div>

                                <p className="text-[11px] md:text-xs text-secondary leading-relaxed font-light italic opacity-80 min-h-[2.5rem]">
                                    {venue.description}
                                </p>

                                <div className="pt-6 border-t border-white/10 flex items-center justify-between group-hover:translate-x-2 transition-transform duration-700 ease-out">
                                    <span className="text-[9px] font-black tracking-[0.4em] uppercase">Reserve</span>
                                    <svg className="w-5 h-5 opacity-30 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
