import { useState, useEffect, useRef } from 'react';

/**
 * ShuffleText - Text that shuffles through random characters before revealing
 * Inspired by: https://reactbits.dev/text-animations/shuffle
 */
export default function ShuffleText({
    children,
    className = '',
    speed = 50,
    delay = 0,
    characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
    onComplete = () => { }
}) {
    const [displayedText, setDisplayedText] = useState('');
    const [isShuffling, setIsShuffling] = useState(false);
    const intervalRef = useRef(null);
    const iterationRef = useRef(0);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setIsShuffling(true);
            let iteration = 0;

            intervalRef.current = setInterval(() => {
                setDisplayedText(
                    children
                        .split('')
                        .map((char, index) => {
                            if (index < iteration) {
                                return children[index];
                            }
                            if (char === ' ') return ' ';
                            return characters[Math.floor(Math.random() * characters.length)];
                        })
                        .join('')
                );

                if (iteration >= children.length) {
                    clearInterval(intervalRef.current);
                    setIsShuffling(false);
                    onComplete();
                }

                iteration += 1 / 3;
            }, speed);
        }, delay);

        return () => {
            clearTimeout(startTimeout);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [children, speed, delay, characters, onComplete]);

    return <span className={className}>{displayedText || children}</span>;
}
