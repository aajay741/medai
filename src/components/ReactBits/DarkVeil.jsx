import { motion } from 'framer-motion';

/**
 * DarkVeil - Animated dark gradient veil background
 * Inspired by: https://reactbits.dev/backgrounds/dark-veil
 */
export default function DarkVeil({
    className = '',
    colors = ['#0a0a0a', '#1a1a2e', '#16213e'],
    animate = true,
    opacity = 0.9
}) {
    const gradientString = colors.join(', ');

    const baseStyle = {
        background: `radial-gradient(circle at 50% 50%, ${gradientString})`,
        backgroundSize: '200% 200%',
        opacity: opacity,
    };

    if (animate) {
        return (
            <motion.div
                className={`absolute inset-0 pointer-events-none ${className}`}
                style={baseStyle}
                animate={{
                    backgroundPosition: [
                        '0% 0%',
                        '100% 100%',
                        '0% 0%',
                    ],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />
        );
    }

    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className}`}
            style={baseStyle}
        />
    );
}
