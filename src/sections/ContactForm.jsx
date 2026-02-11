import { motion } from 'framer-motion'

export default function ContactForm() {
    return (
        <section className="relative py-32 px-6 overflow-hidden bg-[#050505]">
            <div className="container mx-auto max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    {/* Left Side: Content */}
                    <div className="space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2 }}
                        >
                            <span className="text-[#A78BFA] font-black tracking-[0.5em] text-xs uppercase mb-8 block">Inquiry Gate</span>
                            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-12">
                                Send us <br />
                                <span className="text-white/20 italic">A Signal.</span>
                            </h2>
                            <p className="text-xl text-white/60 font-medium italic leading-relaxed max-w-md">
                                Whether you're a performer, a space owner, or an enthusiast, we're ready to bridge the gap.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-8 text-white/40">
                            <div>
                                <span className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA] block mb-4 uppercase">Response Time</span>
                                <p className="text-sm font-black italic uppercase">Within 24 Hours</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA] block mb-4 uppercase">Office Hours</span>
                                <p className="text-sm font-black italic uppercase">10AM - 8PM IST</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="glass p-8 md:p-16 rounded-[4rem] border border-white/5 relative"
                    >
                        <div className="space-y-10">
                            <div className="relative group">
                                <label className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-4 block group-focus-within:text-[#A78BFA] transition-colors">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-b border-white/10 py-4 text-xl text-white focus:outline-none focus:border-[#A78BFA] transition-all font-black placeholder:text-white/10 uppercase"
                                    placeholder="Identity"
                                />
                            </div>

                            <div className="relative group">
                                <label className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-4 block group-focus-within:text-[#A78BFA] transition-colors">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-transparent border-b border-white/10 py-4 text-xl text-white focus:outline-none focus:border-[#A78BFA] transition-all font-black placeholder:text-white/10 uppercase"
                                    placeholder="Signal@medai.in"
                                />
                            </div>

                            <div className="relative group">
                                <label className="text-[10px] font-black tracking-[0.4em] text-[#A78BFA]/60 uppercase mb-4 block group-focus-within:text-[#A78BFA] transition-colors">Frequency / Message</label>
                                <textarea
                                    rows="4"
                                    className="w-full bg-transparent border-b border-white/10 py-4 text-lg text-white focus:outline-none focus:border-[#A78BFA] transition-all font-medium placeholder:text-white/10 italic"
                                    placeholder="State your intent..."
                                />
                            </div>

                            <button className="w-full py-8 bg-[#A78BFA] text-black text-xs font-black tracking-[0.6em] uppercase rounded-full hover:bg-white transition-all duration-700 shadow-3xl hover:scale-[1.02] active:scale-[0.98]">
                                Manifest Signal
                            </button>
                        </div>

                        {/* Abstract Glow Background */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#A78BFA]/5 blur-[100px] rounded-full -z-10 pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
