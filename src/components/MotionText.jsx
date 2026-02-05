import { motion } from 'framer-motion'

export default function MotionText({ children, className = '', delay = 0, variant = 'fadeUp' }) {
    const variants = {
        fadeUp: {
            hidden: { opacity: 0, y: 50 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.8,
                    delay,
                    ease: [0.25, 0.1, 0.25, 1]
                }
            }
        },
        fadeIn: {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    duration: 0.6,
                    delay
                }
            }
        },
        scaleIn: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 0.6,
                    delay,
                    ease: [0.34, 1.56, 0.64, 1]
                }
            }
        },
        slideLeft: {
            hidden: { opacity: 0, x: 100 },
            visible: {
                opacity: 1,
                x: 0,
                transition: {
                    duration: 0.8,
                    delay,
                    ease: [0.25, 0.1, 0.25, 1]
                }
            }
        }
    }

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={variants[variant]}
            className={className}
        >
            {children}
        </motion.div>
    )
}
