import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import NeuralPulse3D from '../components/NeuralPulse3D'
import { PerspectiveCamera, Environment, Float } from '@react-three/drei'

export default function NeuralShowcase() {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-[#030303] py-32 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="order-2 lg:order-1 h-[600px] relative">
                        <Canvas>
                            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1.5} />
                            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />

                            <NeuralPulse3D />

                            <Environment preset="night" />
                        </Canvas>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="order-1 lg:order-2 space-y-12"
                    >
                        <span className="text-[#A78BFA] font-black tracking-[0.6em] text-xs uppercase block mb-8">System Intelligence</span>
                        <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none">
                            The <br />
                            <span className="text-white/20 italic">Neural Core.</span>
                        </h2>
                        <p className="text-white/40 text-xl font-medium max-w-lg leading-relaxed italic">
                            At the heart of MEDAI lies a generative engine that processes human emotion and environmental frequency into a singular performance pulse.
                        </p>

                        <div className="pt-12 border-t border-white/5 flex gap-16">
                            <div>
                                <h4 className="text-4xl font-black text-white italic tracking-tighter">99.9%</h4>
                                <p className="text-[10px] text-[#A78BFA] font-black uppercase tracking-widest mt-2">Sync Fidelity</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-black text-white italic tracking-tighter">REAL</h4>
                                <p className="text-[10px] text-[#A78BFA] font-black uppercase tracking-widest mt-2">Time Response</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background text decoration */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-[0.02] pointer-events-none select-none z-0">
                <span className="text-[30vw] font-black tracking-tighter text-white uppercase">NEURAL</span>
            </div>
        </section>
    )
}
