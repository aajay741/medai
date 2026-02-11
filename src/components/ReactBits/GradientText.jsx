import { motion } from 'framer-motion';

/**
 * GradientText - Animated gradient text with customizable colors
 * Inspired by: https://reactbits.dev/text-animations/gradient-text
 */
export default function GradientText({
    children,
    className = '',
    colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
    animate = true,
    animationDuration = 3,
    direction = 'horizontal' // 'horizontal' or 'vertical'
}) {
    const gradientString = colors.join(', ');
    const angle = direction === 'horizontal' ? '90deg' : '180deg';

    const gradientStyle = {
        background: `linear-gradient(${angle}, ${gradientString})`,
        backgroundSize: animate ? '200% 200%' : '100% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent',
    };

    if (animate) {
        return (
            <motion.span
                className={className}
                style={gradientStyle}
                animate={{
                    backgroundPosition: direction === 'horizontal'
                        ? ['0% 50%', '100% 50%', '0% 50%']
                        : ['50% 0%', '50% 100%', '50% 0%'],
                }}
                transition={{
                    duration: animationDuration,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                {children}
            </motion.span>
        );
    }

    return (
        <span className={className} style={gradientStyle}>
            {children}
        </span>
    );
}
