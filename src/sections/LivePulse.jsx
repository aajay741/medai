import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { motion } from 'framer-motion'
import LiveWave from '../components/LiveWave'

export default function LivePulse() {
    return (
        <section className="relative py-32 px-6 overflow-hidden bg-[#030303]">
            <div className="container mx-auto max-w-7xl flex flex-col lg:grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="text-[#A78BFA] font-black tracking-[0.6em] text-xs uppercase mb-8 block">Active Resonance</span>
                        <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                            Live <br />
                            <span className="text-white/20 italic">Acoustics.</span>
                        </h2>
                        <p className="text-white/40 text-xl font-medium max-w-lg italic">
                            Experience the visualization of sound through our real-time neural mapping system. Every frequency is translated into visual architecture.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <h4 className="text-white font-black text-2xl mb-2">DYNAMIC</h4>
                            <p className="text-white/30 text-xs tracking-widest uppercase italic">Response Rate</p>
                        </div>
                        <div>
                            <h4 className="text-white font-black text-2xl mb-2">NEURAL</h4>
                            <p className="text-white/30 text-xs tracking-widest uppercase italic">Visual Sync</p>
                        </div>
                    </div>
                </div>

                <div className="relative h-[500px] w-full lg:h-[600px] cursor-grab active:cursor-grabbing">
                    <div className="absolute inset-0 bg-[#A78BFA]/5 rounded-[4rem] blur-3xl" />
                    <Canvas camera={{ position: [15, 15, 15], fov: 40 }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <LiveWave />
                        </Float>
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                    </Canvas>

                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 flex flex-col gap-2">
                        <div className="w-12 h-px bg-[#A78BFA]/40" />
                        <span className="text-[10px] text-[#A78BFA] font-black uppercase tracking-widest">Active Signal</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
