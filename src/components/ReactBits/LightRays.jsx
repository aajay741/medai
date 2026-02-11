import { motion } from 'framer-motion';

/**
 * LightRays - Animated light rays background effect
 * Inspired by: https://reactbits.dev/backgrounds/light-rays
 */
export default function LightRays({
    className = '',
    color = '#ffffff',
    opacity = 0.1,
    rayCount = 12,
    animate = true,
    speed = 20
}) {
    const rays = Array.from({ length: rayCount }, (_, i) => i);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <div className="absolute inset-0 flex items-center justify-center">
                {rays.map((ray) => {
                    const rotation = (360 / rayCount) * ray;

                    return (
                        <motion.div
                            key={ray}
                            className="absolute w-1 h-full origin-center"
                            style={{
                                background: `linear-gradient(to bottom, transparent, ${color}, transparent)`,
                                opacity: opacity,
                                transform: `rotate(${rotation}deg)`,
                            }}
                            animate={animate ? {
                                opacity: [opacity, opacity * 0.3, opacity],
                                scaleY: [1, 1.2, 1],
                            } : {}}
                            transition={{
                                duration: speed,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: (ray * speed) / rayCount,
                            }}
                        />
                    );
                })}
            </div>

            {/* Central glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
                style={{
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                    opacity: opacity * 0.5,
                }}
                animate={animate ? {
                    scale: [1, 1.2, 1],
                    opacity: [opacity * 0.5, opacity * 0.3, opacity * 0.5],
                } : {}}
                transition={{
                    duration: speed / 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
        </div>
    );
}
