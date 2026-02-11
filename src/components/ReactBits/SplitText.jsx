import { motion } from 'framer-motion';

/**
 * SplitText - Animates text by splitting into characters with staggered reveal
 * Inspired by: https://reactbits.dev/text-animations/split-text
 */
export default function SplitText({
    children,
    className = '',
    delay = 0,
    duration = 0.05,
    animateBy = 'character', // 'character' or 'word'
    variant = 'fadeUp' // 'fadeUp', 'fadeIn', 'slideLeft', 'slideRight', 'scale'
}) {
    // Split text based on animateBy prop
    const elements = animateBy === 'character'
        ? children.split('')
        : children.split(' ');

    const variants = {
        fadeUp: {
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        },
        fadeIn: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        },
        slideLeft: {
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
        },
        slideRight: {
            hidden: { opacity: 0, x: 20 },
            visible: { opacity: 1, x: 0 }
        },
        scale: {
            hidden: { opacity: 0, scale: 0.5 },
            visible: { opacity: 1, scale: 1 }
        }
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: duration,
                delayChildren: delay,
            },
        },
    };

    return (
        <motion.span
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    variants={variants[variant]}
                    className="inline-block"
                    style={{
                        display: 'inline-block',
                        whiteSpace: animateBy === 'word' ? 'pre' : 'normal'
                    }}
                >
                    {element === ' ' ? '\u00A0' : element}
                    {animateBy === 'word' && index < elements.length - 1 && '\u00A0'}
                </motion.span>
            ))}
        </motion.span>
    );
}
