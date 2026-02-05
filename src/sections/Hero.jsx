import { motion } from 'framer-motion'

export default function Hero() {
    return (
        <section className="h-screen flex items-center justify-center relative section-container overflow-hidden">
            <div className="text-center z-10 w-full px-4">
                {/* Kinetic Text reveal */}
                <div className="overflow-hidden mb-4">
                    <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-[10px] md:text-meta block font-bold"
                    >
                        EST. 2020
                    </motion.span>
                </div>

                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-[12vw] font-black leading-[0.8] tracking-tighter uppercase"
                    >
                        MEDAI
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="mt-8 md:mt-12 max-w-2xl mx-auto"
                >
                    <p className="text-sm md:text-2xl text-secondary uppercase tracking-[0.3em] md:tracking-[0.4em] leading-tight font-light italic">
                        Artist-run <br className="md:hidden" />
                        <span className="text-white font-black not-italic tracking-[0.4em] md:tracking-[0.6em]">BLACK BOX</span> <br />
                        Ecosystem
                    </p>

                    <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-12 text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.5em] font-bold opacity-30 uppercase">
                        <span>Chennai</span>
                        <div className="w-1 h-1 rounded-full bg-white hidden md:block" />
                        <span>Bengaluru</span>
                        <div className="w-1 h-1 rounded-full bg-white hidden md:block" />
                        <span>Coimbatore</span>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                >
                    <div className="w-[1px] h-12 md:h-20 bg-gradient-to-b from-white to-transparent relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-white"
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Decorative Frame - Adjusted for mobile */}
            <div className="absolute inset-6 md:inset-10 border border-white/[0.03] pointer-events-none rounded-[2rem] md:rounded-[3rem]" />
        </section>
    )
}
