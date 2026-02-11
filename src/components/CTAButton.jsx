import { motion } from 'framer-motion'

export default function CTAButton({ children, onClick, variant = 'primary', className = '' }) {
    const baseStyles = "px-8 py-4 rounded-full font-display font-bold text-lg transition-all duration-300 cursor-pointer relative overflow-hidden group"

    const variants = {
        primary: "bg-[#A78BFA] text-black hover:bg-white",
        secondary: "bg-white text-black hover:bg-[#A78BFA]",
        outline: "border-2 border-[#A78BFA] text-[#A78BFA] hover:bg-[#A78BFA] hover:text-black"
    }

    return (
        <motion.button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

            <span className="relative z-10">{children}</span>
        </motion.button>
    )
}
