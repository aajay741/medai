import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Footer({ tier = 2 }) {
    const isLowTier = tier === 0
    const quickLinks = ['Venues', 'Book a Venue', 'About', 'Gallery', 'Contact']

    const scrollTo = (id) => {
        const sectionMap = {
            'Venues': 'venues',
            'Book a Venue': 'hero',
            'About': 'about',
            'Gallery': 'gallery-section',
            'Contact': 'contact',
        }
        document.getElementById(sectionMap[id])?.scrollIntoView({ behavior: 'smooth' })
    }

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
        <footer className="relative pt-16 pb-12 px-6 bg-[#030303] z-20 overflow-hidden border-t border-[#A78BFA]/10">
            {/* Cinematic Background Glow - Only on mid and high tiers */}
            {!isLowTier && (
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-[#A78BFA]/[0.05] blur-[120px] rounded-full pointer-events-none" />
            )}

            <div className="container mx-auto relative z-10">
                <div className="grid lg:grid-cols-3 gap-16 md:gap-24 mb-20">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center lg:items-start text-center lg:text-left"
                    >
                        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-[-0.08em] uppercase leading-none text-white overflow-hidden">
                            <motion.span
                                initial={{ y: '100%' }}
                                whileInView={{ y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="inline-block"
                            >
                                MEDAI.
                            </motion.span>
                        </h2>
                        <p className="text-base text-white/50 max-w-xs leading-relaxed font-medium italic mb-6">
                            A Stage for All. Black box spaces for contemporary performing arts across South India.
                        </p>
                        <p className="text-[10px] font-black tracking-[0.5em] text-[#A78BFA] uppercase opacity-60">
                            CHENNAI • BENGALURU • COIMBATORE
                        </p>

                        {/* Stat */}
                        <div className="mt-8 flex items-center gap-4">
                            <span className="text-3xl font-black text-white">1000+</span>
                            <span className="text-xs font-black tracking-[0.4em] uppercase text-[#A78BFA]/60">Shows Hosted</span>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="flex flex-col items-center lg:items-start"
                    >
                        <span className="text-[11px] md:text-xs font-black tracking-[0.5em] block mb-8 text-[#A78BFA] opacity-80 uppercase">Quick Links</span>
                        <ul className="space-y-5">
                            {quickLinks.map((link) => (
                                <li key={link}>
                                    <button
                                        onClick={() => scrollTo(link)}
                                        className="text-sm font-black tracking-widest text-white/40 hover:text-white hover:text-[#A78BFA] transition-all duration-300 uppercase flex items-center gap-3 group"
                                    >
                                        <span className="w-0 h-[1px] bg-[#A78BFA] group-hover:w-6 transition-all duration-500" />
                                        {link}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="flex flex-col items-center lg:items-start"
                    >
                        <span className="text-[11px] md:text-xs font-black tracking-[0.5em] block mb-8 text-[#A78BFA] opacity-80 uppercase">Get in Touch</span>
                        <div className="space-y-4">
                            <div>
                                <a href={`mailto:${settings.contact_email}`} className="font-black text-lg tracking-tighter hover:text-[#A78BFA] transition-colors text-white block">
                                    {settings.contact_email}
                                </a>
                            </div>
                            <div>
                                <p className="text-white/50 text-sm font-medium">{settings.contact_phone}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <span className="text-[11px] md:text-xs font-black tracking-[0.5em] block mb-6 text-[#A78BFA] opacity-80 uppercase">Our Stages</span>
                            <div className="space-y-2">
                                {[
                                    { city: 'Chennai', link: 'https://share.google/cJbLUT3vpgCAAewym' },
                                    { city: 'Bengaluru', link: 'https://share.google/OCOZmpdqdnNOnvK2N' },
                                    { city: 'Coimbatore', link: 'https://share.google/t3a7On8VUXVPKvgN7' }
                                ].map(({ city, link }) => (
                                    <a key={city} href={link} target="_blank" rel="noopener noreferrer"
                                        className="block text-[11px] font-black tracking-[0.4em] uppercase text-white/30 hover:text-[#A78BFA] transition-colors"
                                    >
                                        {city}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.4em] uppercase font-black text-white/20 text-center md:text-left"
                >
                    <div>"© 2026 Medai Private Limited. All rights reserved.</div>
                    <div className="flex gap-8">
                        {['Privacy', 'Technical Rider', 'Terms'].map(link => (
                            <span key={link} className="hover:text-white cursor-pointer transition-colors">{link}</span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}
