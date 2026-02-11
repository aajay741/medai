import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BubbleMenu - Floating bubble menu with smooth animations
 * Inspired by: https://reactbits.dev/components/bubble-menu
 */
export default function BubbleMenu({
    items = [],
    className = '',
    bubbleColor = 'rgba(99, 102, 241, 0.9)',
    position = 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    mainIcon = '✨'
}) {
    const [isOpen, setIsOpen] = useState(false);

    const positionClasses = {
        'bottom-right': 'bottom-8 right-8',
        'bottom-left': 'bottom-8 left-8',
        'top-right': 'top-8 right-8',
        'top-left': 'top-8 left-8',
    };

    const getItemPosition = (index, total) => {
        const angle = (Math.PI / (total + 1)) * (index + 1);
        const radius = 100;

        // Adjust angle based on position
        let adjustedAngle = angle;
        if (position.includes('right')) {
            adjustedAngle = Math.PI - angle;
        }
        if (position.includes('top')) {
            adjustedAngle = -adjustedAngle;
        }

        return {
            x: Math.cos(adjustedAngle) * radius,
            y: Math.sin(adjustedAngle) * radius,
        };
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
            <AnimatePresence>
                {isOpen && items.map((item, index) => {
                    const pos = getItemPosition(index, items.length);
                    return (
                        <motion.button
                            key={index}
                            className="absolute w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
                            style={{
                                backgroundColor: bubbleColor,
                                bottom: position.includes('bottom') ? 0 : 'auto',
                                top: position.includes('top') ? 0 : 'auto',
                                right: position.includes('right') ? 0 : 'auto',
                                left: position.includes('left') ? 0 : 'auto',
                            }}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                            animate={{
                                scale: 1,
                                x: pos.x,
                                y: pos.y,
                                opacity: 1
                            }}
                            exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                                delay: index * 0.05
                            }}
                            onClick={item.onClick}
                            title={item.label}
                        >
                            <span className="text-2xl">{item.icon}</span>
                        </motion.button>
                    );
                })}
            </AnimatePresence>

            <motion.button
                className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl relative z-10"
                style={{ backgroundColor: bubbleColor }}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ rotate: isOpen ? 135 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                <span className="text-3xl">{mainIcon}</span>
            </motion.button>
        </div>
    );
}
