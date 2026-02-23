import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function Venues({ onBookClick }) {
    const containerRef = useRef(null)
    const venues = [
        {
            city: "CHENNAI",
            capacity: "120 Seater",
            description: "Theatre, classical dance, contemporary acts, indie music, stand-up",
            image: "https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?q=80&w=2070"
        },
        {
            city: "BENGALURU",
            capacity: "170 Seater",
            description: "Festivals, comedy, concerts, indie bands, experimental showcases",
            image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070"
        },
        {
            city: "COIMBATORE",
            capacity: "220 Seater",
            description: "Large dance shows, theatre, cultural programs, live music concerts",
            image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070"
        }
    ]

    return (
        <section ref={containerRef} className="relative w-full py-12 md:py-24 mt-24 md:my-0 section-container overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 border-b border-white/5 pb-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="text-xs md:text-sm font-black tracking-[0.6em] text-[#A78BFA] block mb-4 md:mb-6 uppercase opacity-80">03 / The Network</span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Locations.</h2>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-sm md:text-right mt-4 md:mt-0"
                >
                    <p className="text-[#A78BFA] text-sm md:text-base italic font-medium opacity-80 leading-relaxed">
                        Artist-run spaces designed to provide a cohesive ecosystem for the arts.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 xl:gap-12">
                {venues.map((venue, i) => (
                    <VenueCard key={i} venue={venue} index={i} onBookClick={onBookClick} />
                ))}
            </div>
        </section>
    )
}

function VenueCard({ venue, index, onBookClick }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -10 }}
            onClick={() => onBookClick(venue.city)}
            className="group relative h-[450px] md:h-[600px] w-full rounded-[4rem] overflow-hidden glass border border-[#A78BFA]/10 shadow-3xl cursor-pointer transition-all duration-700"
        >
            {/* Background Image Enhancement */}
            <div className="absolute inset-0 z-0 bg-black">
                <motion.img
                    src={venue.image}
                    initial={{ scale: 1.2, filter: 'grayscale(100%) brightness(0.3)' }}
                    whileHover={{ scale: 1.1, filter: 'grayscale(0%) brightness(0.6)' }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover"
                    alt={venue.city}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent opacity-100" />
            </div>

            {/* Content Container with reveal effects */}
            <div className="relative z-10 h-full p-10 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="space-y-1"
                    >
                        <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none text-white whitespace-pre-line group-hover:text-[#A78BFA] transition-colors duration-500">
                            MEDAI <br /><span className="text-[#A78BFA]/90 italic">{venue.city}</span>
                        </h3>
                    </motion.div>

                </div>

                <div className="space-y-10 group-hover:translate-y-[-10px] transition-transform duration-700 ease-[0.16,1,0.3,1]">
                    <div className="flex gap-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                        >
                            <div className="text-[10px] uppercase tracking-[0.5em] mb-3 font-black text-[#A78BFA]">Audience</div>
                            <div className="text-base font-black tracking-tight text-white">{venue.capacity}</div>
                        </motion.div>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1 + index * 0.1 }}
                        className="text-sm md:text-base text-white/80 leading-relaxed font-bold italic group-hover:text-white transition-colors duration-500 line-clamp-2"
                    >
                        {venue.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        whileInView={{ opacity: 1, width: '100%' }}
                        transition={{ delay: 1.1 + index * 0.1, duration: 1 }}
                        className="pt-8 border-t border-white/5 flex items-center justify-between overflow-hidden"
                    >
                        <span className="text-[10px] font-black tracking-[0.6em] uppercase text-[#A78BFA] opacity-60 group-hover:opacity-100 group-hover:tracking-[0.8em] transition-all duration-700">Access Details</span>
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 45 }}
                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-[#A78BFA] group-hover:text-black transition-all duration-500 shadow-2xl"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
