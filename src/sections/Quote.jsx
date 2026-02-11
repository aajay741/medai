import { motion, useScroll, useTransform } from 'framer-motion'

export default function Quote() {
    const { scrollYProgress } = useScroll()

    // 1. KINETIC HERITAGE (Parallax depth)
    const artY = useTransform(scrollYProgress, [0.75, 1], [0, -100])
    const lifeY = useTransform(scrollYProgress, [0.75, 1], [0, 100])
    const labelOpacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 0.05, 0])

    return (
        <section className="min-h-screen flex items-center justify-center text-center px-6 relative overflow-hidden bg-white">
            {/* Top transition gradient from black to white - Reduced height */}
            <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-[#030303] to-white pointer-events-none z-0" />

            <div className="container mx-auto max-w-6xl relative z-10 pt-48 pb-10 text-black">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="text-xs md:text-sm uppercase tracking-[0.8em] font-black mb-12 block text-[#A78BFA] text-center opacity-90 drop-shadow-sm">THE MANIFESTO</span>
                    <h2 className="text-5xl md:text-[8.5vw] font-black leading-[0.85] tracking-tighter mb-16 uppercase">
                        TO BRING ALL ART FORMS <br />
                        UNDER ONE ROOF, MAKING <br />
                        MEDAI TRULY A <br />
                        <span className="bg-[#030303] text-white px-8 md:px-12 py-3 md:py-5 inline-block transform -skew-x-12 italic mt-6 shadow-2xl">STAGE FOR ALL.</span>
                    </h2>
                </motion.div>
            </div>

            {/* Decorative Background Labels - Kinetic Motion */}
            <div className="absolute top-0 left-0 w-full h-full flex justify-between px-10 pointer-events-none select-none text-black">
                <motion.span style={{ y: artY, opacity: labelOpacity }} className="text-[25vw] font-black rotate-90 leading-none h-fit self-center">ART</motion.span>
                <motion.span style={{ y: lifeY, opacity: labelOpacity }} className="text-[25vw] font-black -rotate-90 leading-none h-fit self-center">LIFE</motion.span>
            </div>

            {/* Bottom transition gradient back to black - Reduced height */}
            <div className="absolute bottom-0 left-0 w-full h-[8vh] bg-gradient-to-t from-[#030303] to-white pointer-events-none z-0" />
        </section>
    )
}
