import MotionText from '../components/MotionText'
import CTAButton from '../components/CTAButton'
import { motion } from 'framer-motion'

export default function DetailsScene() {
    const shows = [
        {
            date: 'March 15',
            day: 'Friday',
            time: '8:00 PM',
            venue: 'The Comedy Arena',
            city: 'Los Angeles, CA',
            price: '$45',
            status: 'Available'
        },
        {
            date: 'March 16',
            day: 'Saturday',
            time: '7:00 PM',
            venue: 'The Comedy Arena',
            city: 'Los Angeles, CA',
            price: '$45',
            status: 'Selling Fast'
        },
        {
            date: 'March 17',
            day: 'Sunday',
            time: '6:00 PM',
            venue: 'The Comedy Arena',
            city: 'Los Angeles, CA',
            price: '$50',
            status: 'VIP Only'
        }
    ]

    return (
        <section className="min-h-screen flex items-center justify-center py-20 relative">
            <div className="container mx-auto px-6 z-10">
                <MotionText variant="fadeUp" delay={0.2}>
                    <h2 className="font-display font-black text-6xl md:text-7xl mb-4 text-center text-white">
                        Show Details
                    </h2>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.3}>
                    <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                        Choose your perfect night of comedy. All shows include premium seating and complimentary drinks.
                    </p>
                </MotionText>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {shows.map((show, index) => (
                        <MotionText
                            key={index}
                            variant="fadeUp"
                            delay={0.4 + index * 0.1}
                        >
                            <motion.div
                                className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 overflow-hidden group"
                                whileHover={{
                                    scale: 1.02,
                                    borderColor: 'rgba(255, 51, 102, 0.5)',
                                    boxShadow: '0 20px 60px rgba(255, 51, 102, 0.3)'
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Status badge */}
                                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${show.status === 'Available' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                                        show.status === 'Selling Fast' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                                            'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                                    }`}>
                                    {show.status}
                                </div>

                                {/* Date */}
                                <div className="mb-6">
                                    <div className="text-5xl font-display font-black text-comedy-red mb-1">
                                        {show.date}
                                    </div>
                                    <div className="text-xl text-gray-400 font-display">
                                        {show.day}
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-comedy-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-300">{show.time}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-comedy-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <div className="text-gray-300">{show.venue}</div>
                                            <div className="text-sm text-gray-500">{show.city}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-gray-400">Starting at</span>
                                    <span className="text-3xl font-display font-bold text-comedy-gold">
                                        {show.price}
                                    </span>
                                </div>

                                {/* CTA */}
                                <CTAButton variant="primary" className="w-full">
                                    Get Tickets
                                </CTAButton>

                                {/* Hover glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-comedy-red/0 to-comedy-purple/0 group-hover:from-comedy-red/10 group-hover:to-comedy-purple/10 transition-all duration-500 pointer-events-none rounded-3xl" />
                            </motion.div>
                        </MotionText>
                    ))}
                </div>
            </div>
        </section>
    )
}
