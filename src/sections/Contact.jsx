import { motion } from 'framer-motion'

export default function Contact() {
    return (
        <footer className="relative pt-64 pb-12 px-6 bg-[#030303] z-20">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-24 mb-48">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="heading-huge mb-12 tracking-[-0.08em]">TALK.</h2>
                        <p className="text-2xl text-secondary max-w-sm leading-tight font-light italic">
                            Ready to take the stage? Connect with our team to book your curation.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-12">
                            <div>
                                <span className="text-meta block mb-6 opacity-40">Locations</span>
                                <ul className="space-y-3 font-medium text-sm">
                                    <li>Chennai - Alwarpet</li>
                                    <li>Bengaluru - Koramangala</li>
                                    <li>Coimbatore - Race Course</li>
                                </ul>
                            </div>
                            <div>
                                <span className="text-meta block mb-6 opacity-40">Social</span>
                                <ul className="space-y-3 font-medium text-sm">
                                    <li><a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px]">Instagram</a></li>
                                    <li><a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px]">Facebook</a></li>
                                    <li><a href="#" className="hover:text-blue-500 transition-colors uppercase tracking-widest text-[10px]">LinkedIn</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-12 flex flex-col justify-between">
                            <div>
                                <span className="text-meta block mb-6 opacity-40">Direct</span>
                                <p className="font-bold text-lg mb-1">hello@medai.in</p>
                                <p className="opacity-40 text-sm italic">+91 98765 43210</p>
                            </div>
                            <div className="pt-8">
                                <button className="w-full py-5 border border-white/10 hover:bg-white hover:text-black transition-all duration-700 text-[10px] tracking-[0.5em] uppercase font-bold rounded-full">
                                    Join Artist Network
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-20 text-[9px] tracking-[0.4em] uppercase font-bold">
                    <div>© 2026 MEDAI PERFORMANCE SPACES</div>
                    <div className="flex gap-12">
                        <span className="hover:opacity-100 cursor-pointer transition-opacity">Privacy</span>
                        <span className="hover:opacity-100 cursor-pointer transition-opacity">Technical Rider</span>
                        <span className="hover:opacity-100 cursor-pointer transition-opacity">Terms</span>
                    </div>
                    <div className="opacity-40">Crafted for Excellence</div>
                </div>
            </div>
        </footer>
    )
}
