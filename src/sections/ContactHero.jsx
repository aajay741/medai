import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import NeuralPulse3D from '../components/NeuralPulse3D'
import { Suspense } from 'react'

export default function ContactHero() {
    const [settings, setSettings] = useState({
        contact_email: 'medaibookings@gmail.com',
        contact_phone: '+91 98765 43210'
    })

    useEffect(() => {
        fetch('/backend/api/site_settings.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) setSettings(prev => ({ ...prev, ...data.data }))
            })
            .catch(err => console.error('Error fetching settings:', err))
    }, [])

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-[#030303]">
            {/* Cinematic 3D Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <Canvas camera={{ position: [0, 0, 25], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Suspense fallback={null}>
                        <NeuralPulse3D />
                    </Suspense>
                </Canvas>
                <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
            </div>

            <div className="container mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="text-[#A78BFA] font-black tracking-[0.6em] text-xs md:text-sm uppercase mb-12 block">Connect / Collaborate</span>
                    <h1 className="text-[12vw] md:text-[10vw] font-black text-white uppercase leading-[0.8] tracking-tighter mb-16">
                        The Stage <br />
                        <span className="text-white/30 italic">Awaits.</span>
                    </h1>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto mt-20">
                    {[
                        { label: 'General Inquiry', val: settings.contact_email },
                        { label: 'Booking Desk', val: 'booking@medai.in' },
                        { label: 'Artist Support', val: settings.contact_phone }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            className="bg-white/[0.02] border border-white/5 backdrop-blur-xl p-10 rounded-[4rem] hover:border-[#A78BFA]/30 transition-all group relative overflow-hidden"
                        >
                            <span className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-4 block group-hover:text-[#A78BFA] transition-colors">
                                {item.label}
                            </span>
                            <span className="text-lg md:text-xl font-black text-white group-hover:tracking-wider transition-all duration-500 italic">
                                {item.val}
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-tr from-[#A78BFA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Decorative Vertical Line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-t from-[#A78BFA]/40 to-transparent" />
        </section>
    )
}
