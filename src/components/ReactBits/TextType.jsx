import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * TextType - Typewriter effect animation
 * Inspired by: https://reactbits.dev/text-animations/text-type
 */
export default function TextType({
    children,
    className = '',
    speed = 50, // milliseconds per character
    delay = 0,
    showCursor = true,
    cursorChar = '|',
    onComplete = () => { }
}) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            if (currentIndex < children.length) {
                const timeout = setTimeout(() => {
                    setDisplayedText(prev => prev + children[currentIndex]);
                    setCurrentIndex(prev => prev + 1);
                }, speed);

                return () => clearTimeout(timeout);
            } else if (!isComplete) {
                setIsComplete(true);
                onComplete();
            }
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [currentIndex, children, speed, delay, isComplete, onComplete]);

    return (
        <span className={className}>
            {displayedText}
            {showCursor && !isComplete && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                    className="inline-block"
                >
                    {cursorChar}
                </motion.span>
            )}
        </span>
    );
}
