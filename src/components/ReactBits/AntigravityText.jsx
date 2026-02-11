import { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * AntigravityText - Text that floats upward with a gravity-defying effect
 * Inspired by: https://reactbits.dev/animations/antigravity
 */
export default function AntigravityText({
    children,
    className = '',
    delay = 0,
    duration = 1.2,
    floatDistance = -20,
    stagger = 0.05
}) {
    const controls = useAnimation();
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    controls.start('visible');
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [controls]);

    // Split text into words
    const words = children.split(' ');

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
            },
        },
    };

    const wordVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            filter: 'blur(10px)',
        },
        visible: {
            opacity: 1,
            y: floatDistance,
            filter: 'blur(0px)',
            transition: {
                duration: duration,
                ease: [0.25, 0.4, 0.25, 1],
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={`inline-flex flex-wrap gap-2 ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
        >
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    variants={wordVariants}
                    className="inline-block"
                    style={{ display: 'inline-block' }}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
}
