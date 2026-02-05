import MotionText from '../components/MotionText'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function GalleryScene() {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const images = [
        { title: 'Opening Night', description: 'Sold out in 2 hours' },
        { title: 'Standing Ovation', description: '5-minute applause' },
        { title: 'Meet & Greet', description: 'Exclusive VIP experience' },
        { title: 'The Crowd', description: '500+ fans laughing together' },
        { title: 'Backstage', description: 'Behind the scenes magic' },
        { title: 'Finale', description: 'Unforgettable moments' },
    ]

    return (
        <section className="min-h-screen flex items-center justify-center py-20 relative">
            <div className="container mx-auto px-6 z-10">
                <MotionText variant="fadeUp" delay={0.2}>
                    <h2 className="font-display font-black text-6xl md:text-7xl mb-4 text-center text-white">
                        Moments That Matter
                    </h2>
                </MotionText>

                <MotionText variant="fadeUp" delay={0.3}>
                    <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                        Relive the magic from our previous shows. These are the memories we create together.
                    </p>
                </MotionText>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {images.map((image, index) => (
                        <MotionText
                            key={index}
                            variant="scaleIn"
                            delay={0.4 + index * 0.05}
                        >
                            <motion.div
                                className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group"
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Placeholder gradient background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${index % 6 === 0 ? 'from-comedy-red to-comedy-purple' :
                                        index % 6 === 1 ? 'from-comedy-purple to-comedy-gold' :
                                            index % 6 === 2 ? 'from-comedy-gold to-comedy-red' :
                                                index % 6 === 3 ? 'from-purple-600 to-pink-600' :
                                                    index % 6 === 4 ? 'from-orange-600 to-red-600' :
                                                        'from-blue-600 to-purple-600'
                                    } opacity-80`} />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{
                                            opacity: hoveredIndex === index ? 1 : 0,
                                            y: hoveredIndex === index ? 0 : 20
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="font-display font-bold text-2xl mb-2 text-white">
                                            {image.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm">
                                            {image.description}
                                        </p>
                                    </motion.div>

                                    {/* Icon when not hovering */}
                                    <motion.div
                                        initial={{ opacity: 1 }}
                                        animate={{
                                            opacity: hoveredIndex === index ? 0 : 1,
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <svg
                                            className="w-16 h-16 text-white/50"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </motion.div>
                                </div>

                                {/* Glow effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-t from-comedy-red/50 via-transparent to-transparent" />
                                </div>
                            </motion.div>
                        </MotionText>
                    ))}
                </div>
            </div>
        </section>
    )
}
