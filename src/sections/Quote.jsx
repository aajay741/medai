import { motion } from 'framer-motion'

export default function Quote({ scrollProgress }) {
    return (
        <section className="min-h-screen flex items-center justify-center text-center px-6 relative overflow-hidden bg-white">
            {/* Top transition gradient from black to white - Reduced height */}
            <div className="absolute top-0 left-0 w-full h-[15vh] bg-gradient-to-b from-[#030303] to-white pointer-events-none z-0" />

            <div className="container mx-auto max-w-6xl relative z-10 py-16 text-black">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="text-xs uppercase tracking-[0.8em] font-black opacity-30 mb-8 block">THE MANIFESTO</span>
                    <h2 className="text-[7vw] font-black leading-[0.85] tracking-tighter mb-16 uppercase">
                        TO BRING ALL ART FORMS <br />
                        UNDER ONE ROOF, MAKING <br />
                        MEDAI TRULY A <br />
                        <span className="bg-[#030303] text-white px-8 py-2 inline-block transform -skew-x-12 italic mt-4">STAGE FOR ALL.</span>
                    </h2>
                </motion.div>
            </div>

            {/* Decorative Background Labels */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-between px-10 opacity-[0.03] pointer-events-none select-none text-black">
                <span className="text-[20vw] font-black rotate-90 leading-none">ART</span>
                <span className="text-[20vw] font-black -rotate-90 leading-none">LIFE</span>
            </div>

            {/* Bottom transition gradient back to black - Reduced height */}
            <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-gradient-to-t from-[#030303] to-white pointer-events-none z-0" />
        </section>
    )
}
