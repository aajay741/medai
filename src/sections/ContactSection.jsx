import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const INQUIRY_TYPES = [
    'Select inquiry type',
    'Venue Booking',
    'Event Collaboration',
    'Artist Residency',
    'Festival Partnership',
    'General Inquiry'
]

const locations = [
    {
        city: "MEDAI Chennai",
        address: "123 Cenotaph Road",
        area: "Alwarpet",
        pin: "Chennai - 600018",
        email: "chennai@medai.org",
        phone: "+91 98765 43210"
    },
    {
        city: "MEDAI Bengaluru",
        address: "Museum Rd, opp. Patricks Church",
        area: "Shanthala Nagar, Richmond Town",
        pin: "Bengaluru, Karnataka - 560025",
        email: "medaibookings@gmail.com",
        phone: "+91 98765 43211"
    },
    {
        city: "MEDAI Coimbatore",
        address: "Hope College Campus",
        area: "Peelamedu",
        pin: "Coimbatore - 641004",
        email: "coimbatore@medai.org",
        phone: "+91 98765 43212"
    }
]

export default function ContactSection({ tier = 2, isMobile = false }) {
    const isLowTier = tier === 0 || isMobile
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)
    const [settings, setSettings] = useState({
        contact_email: 'medaibookings@gmail.com',
        contact_phone: '+91 98765 43210'
    })

    useEffect(() => {
        fetch('/backend/api/site_settings.php')
            .then(res => res.json())
            .then(data => {
                if (data.success) setSettings(data.data)
            })
            .catch(err => console.error('Error fetching settings:', err))
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: numericValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 4000)
    }

    return (
        <section id="contact" className="relative py-24 px-6 overflow-hidden bg-[#030303] border-t border-[#A78BFA]/10">
            {/* Background glow - Only on mid and high tiers */}
            {!isLowTier && !isMobile && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-[#A78BFA]/[0.04] blur-[120px] rounded-full pointer-events-none" />
            )}

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Section Header */}
                <div className="mb-16 md:mb-24">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-xs md:text-sm font-black tracking-[0.6em] text-[#A78BFA] block mb-4 uppercase opacity-80"
                    >
                        06 / Get in Touch
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: isLowTier ? 10 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: isLowTier ? 0.8 : 1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-8xl font-black tracking-tighter uppercase text-white leading-none"
                    >
                        Get in Touch.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-white/40 text-base max-w-md"
                    >
                        For bookings, collaborations, and inquiries
                    </motion.p>
                </div>

                {/* Location Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {locations.map((loc, i) => (
                        <motion.div
                            key={i}
                            initial={isLowTier ? { opacity: 0 } : { opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * (isLowTier ? 0.05 : 0.1), duration: isLowTier ? 0.8 : 1, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={isLowTier ? {} : { y: -8 }}
                            className="glass p-8 md:p-10 rounded-[3rem] border border-white/5 shadow-3xl transition-all duration-700 bg-white/[0.01] group"
                        >
                            <div className="mb-6 w-12 h-12 rounded-2xl bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center group-hover:bg-[#A78BFA] transition-all duration-500">
                                <svg className="w-5 h-5 text-[#A78BFA] group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black tracking-tighter uppercase text-white mb-4 group-hover:text-[#A78BFA] transition-colors">
                                {loc.city}
                            </h3>
                            <div className="space-y-1 mb-6">
                                <p className="text-white/40 text-sm font-medium">{loc.address}</p>
                                <p className="text-white/40 text-sm font-medium">{loc.area}</p>
                                <p className="text-white/40 text-sm font-medium">{loc.pin}</p>
                            </div>
                            <div className="border-t border-white/5 pt-6 space-y-2">
                                <a href={`mailto:${loc.email}`} className="block text-[#A78BFA] text-sm font-black hover:text-white transition-colors">
                                    {loc.email}
                                </a>
                                <p className="text-white/50 text-sm font-medium tracking-wide">{loc.phone}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Left: CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="space-y-8"
                    >
                        <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-[0.85]">
                            General <br /><span className="text-white/20 italic">Inquiry.</span>
                        </h3>
                        <p className="text-xl text-white/50 font-medium leading-relaxed max-w-sm italic">
                            Whether you're a performer, organiser, or enthusiast — we're ready to help.
                        </p>
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#A78BFA] text-xs font-black">✉</span>
                                </div>
                                <div>
                                    <p className="text-white font-black text-lg tracking-tight hover:text-[#A78BFA] transition-colors cursor-pointer">{settings.contact_email}</p>
                                    <p className="text-white/30 text-xs tracking-widest uppercase font-bold">General Contact</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/30 flex items-center justify-center flex-shrink-0">
                                    <span className="text-[#A78BFA] text-xs font-black">☎</span>
                                </div>
                                <div>
                                    <p className="text-white font-black text-lg tracking-tight">{settings.contact_phone}</p>
                                    <p className="text-white/30 text-xs tracking-widest uppercase font-bold">10AM – 8PM IST</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.form
                        onSubmit={handleSubmit}
                        initial={isLowTier ? { opacity: 0 } : { opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: isLowTier ? 0.8 : 1.2, delay: isLowTier ? 0.1 : 0.2 }}
                        className="glass p-8 md:p-12 rounded-[3rem] border border-white/5 relative space-y-8"
                    >
                        {!isLowTier && !isMobile && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#A78BFA]/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
                        )}

                        {/* Name */}
                        <div className="group">
                            <label className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-3 block group-focus-within:text-[#A78BFA] transition-colors">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                                className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white focus:outline-none focus:border-[#A78BFA] transition-all font-medium placeholder:text-white/10"
                            />
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-3 block group-focus-within:text-[#A78BFA] transition-colors">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                                className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white focus:outline-none focus:border-[#A78BFA] transition-all font-medium placeholder:text-white/10"
                            />
                        </div>

                        {/* Phone */}
                        <div className="group">
                            <label className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-3 block group-focus-within:text-[#A78BFA] transition-colors">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white focus:outline-none focus:border-[#A78BFA] transition-all font-medium placeholder:text-white/10"
                            />
                        </div>

                        {/* Inquiry Type */}
                        <div className="group">
                            <label className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-3 block group-focus-within:text-[#A78BFA] transition-colors">
                                Inquiry Type
                            </label>
                            <select
                                name="inquiryType"
                                value={formData.inquiryType}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white/70 focus:outline-none focus:border-[#A78BFA] transition-all font-medium appearance-none cursor-pointer"
                            >
                                {INQUIRY_TYPES.map(t => (
                                    <option key={t} value={t} className="bg-[#030303] text-white">{t}</option>
                                ))}
                            </select>
                        </div>

                        {/* Message */}
                        <div className="group">
                            <label className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-3 block group-focus-within:text-[#A78BFA] transition-colors">
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Tell us about your inquiry..."
                                className="w-full bg-transparent border-b border-white/10 py-3 text-lg text-white focus:outline-none focus:border-[#A78BFA] transition-all font-medium placeholder:text-white/10 resize-none"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full py-6 rounded-full text-xs font-black tracking-[0.6em] uppercase transition-all duration-700 shadow-3xl ${submitted
                                ? 'bg-green-400 text-black'
                                : 'bg-[#A78BFA] text-black hover:bg-white'
                                }`}
                        >
                            {submitted ? '✓ Message Sent' : 'Send Message'}
                        </motion.button>
                    </motion.form>
                </div>
            </div>
        </section>
    )
}
