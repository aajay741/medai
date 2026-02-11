import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import SoundWave from '../components/ThreeD/SoundWave'
import AudienceSeats from '../components/ThreeD/AudienceSeats'

export default function Features() {
    const items = [
        { title: "Generative Humor", desc: "Environment that learns what makes your city laugh." },
        { title: "Spatial immersion", desc: "3D audio that places you in the center of the club." },
        { title: "Visual Synthesis", desc: "Real-time visuals mapped to every frequency." }
    ]

    return (
        <section className="min-h-screen flex flex-col justify-center relative py-32 px-6 overflow-hidden">
            {/* 3D Background Visualization */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <Canvas camera={{ position: [0, 5, 20], fov: 50 }}>
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Suspense fallback={null}>
                        <SoundWave position={[-8, 0, 0]} color="#FFD700" />
                        <SoundWave position={[0, 0, -5]} color="#A78BFA" />
                        <SoundWave position={[8, 0, 0]} color="#FF69B4" />
                        <AudienceSeats position={[0, -8, 5]} rows={3} seatsPerRow={6} />
                    </Suspense>
                </Canvas>
            </div>

            <div className="container mx-auto relative z-10">
                <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-meta mb-12 block"
                >
                    02 / Features
                </motion.span>

                <div className="space-y-1">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="group border-t border-white/10 py-12 flex flex-col md:flex-row md:items-center justify-between hover:bg-white/5 transition-colors px-4 -mx-4 cursor-pointer relative"
                        >
                            <h3 className="heading-medium text-white/40 group-hover:text-white transition-colors duration-500 relative z-10">
                                {item.title}
                            </h3>
                            <p className="max-w-xs text-secondary mt-4 md:mt-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 relative z-10">
                                {item.desc}
                            </p>

                            {/* Animated background on hover */}
                            <motion.div
                                className="absolute inset-0 bg-[#A78BFA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                layoutId="feature-hover-bg"
                            />
                        </motion.div>
                    ))}
                    <div className="border-t border-white/10" />
                </div>
            </div>
        </section>
    )
}
