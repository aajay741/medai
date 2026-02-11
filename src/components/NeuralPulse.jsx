import { motion } from 'framer-motion'

export default function NeuralPulse() {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-white/10 rounded-full"
            />

            {/* Middle Rotating Ring (Reverse) */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border border-white/20 rounded-full border-dashed"
            />

            {/* Inner Pulsing Core */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-20 bg-gradient-to-br from-[#A78BFA] to-purple-900 rounded-full blur-2xl opacity-30"
            />

            {/* Central Stage Content */}
            <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Microphone Icon */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative"
                >
                    {/* Mic Stand */}
                    <div className="w-1 h-24 bg-gradient-to-b from-white/40 to-white/10 mx-auto mb-2" />

                    {/* Mic Head */}
                    <div className="w-16 h-20 bg-gradient-to-br from-[#A78BFA] to-purple-900 rounded-full relative mx-auto shadow-2xl shadow-purple-500/50">
                        {/* Mic Grill Lines */}
                        <div className="absolute inset-2 flex flex-col justify-center gap-1">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-px bg-white/20" />
                            ))}
                        </div>

                        {/* Glow Effect */}
                        <motion.div
                            animate={{ opacity: [0.3, 0.8, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-[#A78BFA] rounded-full blur-xl"
                        />
                    </div>
                </motion.div>

                {/* LIVE Text */}
                <motion.div
                    animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [0.95, 1.05, 0.95]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl md:text-6xl font-black tracking-tighter text-white/20 select-none"
                >
                    LIVE
                </motion.div>

                {/* Floating "Data Nodes" */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            rotate: 360,
                            scale: [1, 1.5, 1],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                            rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2 + i, repeat: Infinity, ease: "easeInOut" },
                            opacity: { duration: 2 + i, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute w-2 h-2 bg-white rounded-full"
                        style={{
                            originX: "50%",
                            originY: "50%",
                            left: "50%",
                            top: "50%",
                            marginLeft: "-4px",
                            marginTop: "-4px",
                            transform: `translate(${Math.cos(i * 60 * Math.PI / 180) * 120}px, ${Math.sin(i * 60 * Math.PI / 180) * 120}px)`
                        }}
                    />
                ))}
            </div>

            {/* Scanning Line Effect */}
            <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none"
            />
        </div>
    )
}
