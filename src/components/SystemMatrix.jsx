import { motion } from 'framer-motion'

export default function SystemMatrix() {
    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
                {[...Array(36)].map((_, i) => (
                    <div key={i} className="border border-white/20" />
                ))}
            </div>

            {/* Scanning Radar Lines */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-[#A78BFA]/10 to-transparent rounded-full opacity-30"
                style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }}
            />

            {/* Orbiting Nodes */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-10 flex items-center justify-center"
                    style={{ transform: `rotate(${i * 45}deg)` }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-2 h-2 bg-[#A78BFA] rounded-full shadow-[0_0_10px_#A78BFA]"
                        style={{ transform: `translate(120px, 0)` }}
                    />
                </motion.div>
            ))}

            {/* Central Glow */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-20 bg-[#A78BFA] rounded-full blur-[80px]"
            />

            {/* Core Label */}
            <div className="relative z-10">
                <motion.span
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-white font-black tracking-[1em] text-xs uppercase"
                >
                    Active
                </motion.span>
            </div>
        </div>
    )
}
