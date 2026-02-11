import React, { useLayoutEffect, useRef, useCallback } from 'react';
import './ScrollStack.css';

/**
 * ScrollStackItem Component
 * Each item in the stack is wrapped in a container that stays static in the layout
 * while the card inside it is transformed. This prevents feedback loops and shaking.
 */
export const ScrollStackItem = ({ children, itemClassName = '' }) => (
    <div className="scroll-stack-card-container">
        <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
    </div>
);

/**
 * ScrollStack Component
 * A performant card stacking effect that works smoothly even with Lenis smooth scroll.
 */
const ScrollStack = ({
    children,
    className = '',
    itemDistance = 100,
    itemScale = 0.03,
    itemStackDistance = 30,
    stackPosition = '20%',
    scaleEndPosition = '10%',
    baseScale = 0.85,
    rotationAmount = 0,
    blurAmount = 0,
    onStackComplete
}) => {
    const scrollerRef = useRef(null);
    const stackCompletedRef = useRef(false);
    const cardsRef = useRef([]);
    const offsetsRef = useRef([]);
    const isUpdatingRef = useRef(false);

    // Helper to parse '20%' or 200 into pixel values
    const parsePercentage = useCallback((value, containerHeight) => {
        if (typeof value === 'string' && value.includes('%')) {
            return (parseFloat(value) / 100) * containerHeight;
        }
        return parseFloat(value);
    }, []);

    // Core animation logic
    const updateCardTransforms = useCallback(() => {
        if (!cardsRef.current.length || !offsetsRef.current.length || isUpdatingRef.current) return;

        isUpdatingRef.current = true;

        const scrollTop = window.scrollY;
        const containerHeight = window.innerHeight;
        const stackPositionPx = parsePercentage(stackPosition, containerHeight);
        const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

        // Calculate where the stacking session ends
        const endElement = scrollerRef.current?.querySelector('.scroll-stack-end');
        const endElementTop = endElement ? endElement.getBoundingClientRect().top + scrollTop : 0;
        const pinEnd = endElementTop - (containerHeight / 2);

        cardsRef.current.forEach((card, i) => {
            if (!card) return;

            const cardTop = offsetsRef.current[i];

            // Define trigger points
            const triggerStart = cardTop - stackPositionPx - (itemStackDistance * i);
            const triggerEnd = cardTop - scaleEndPositionPx;
            const pinStart = triggerStart;

            // 1. Calculate Progress (0 to 1) for scaling/rotation
            const scrollDistance = triggerEnd - triggerStart;
            const progress = scrollDistance <= 0 ? (scrollTop >= triggerStart ? 1 : 0) : Math.max(0, Math.min(1, (scrollTop - triggerStart) / scrollDistance));

            // 2. Scaling & Rotation
            const targetScale = baseScale + (i * itemScale);
            const scale = 1 - (progress * (1 - targetScale));
            const rotation = rotationAmount ? i * rotationAmount * progress : 0;

            // 3. Pinning / Translation
            let translateY = 0;
            const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

            if (isPinned) {
                translateY = scrollTop - cardTop + stackPositionPx + (itemStackDistance * i);
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx + (itemStackDistance * i);
            }

            // 4. Apply Styles (Direct DOM manipulation for performance)
            card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`;

            // 5. Blur Effect
            if (blurAmount) {
                let topCardIndex = 0;
                // Find which card is currently at the top of the stack
                for (let j = 0; j < cardsRef.current.length; j++) {
                    const jCardTop = offsetsRef.current[j];
                    const jTriggerStart = jCardTop - stackPositionPx - (itemStackDistance * j);
                    if (scrollTop >= jTriggerStart) topCardIndex = j;
                }
                const blur = (i < topCardIndex) ? Math.max(0, (topCardIndex - i) * blurAmount) : 0;
                card.style.filter = blur > 0 ? `blur(${blur}px)` : 'none';
            }

            // Completion Callback
            if (i === cardsRef.current.length - 1) {
                const isInStack = scrollTop >= pinStart && scrollTop <= pinEnd;
                if (isInStack && !stackCompletedRef.current) {
                    stackCompletedRef.current = true;
                    onStackComplete?.();
                } else if (!isInStack && stackCompletedRef.current) {
                    stackCompletedRef.current = false;
                }
            }
        });

        isUpdatingRef.current = false;
    }, [baseScale, blurAmount, itemScale, itemStackDistance, onStackComplete, parsePercentage, rotationAmount, scaleEndPosition, stackPosition]);

    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        // Cache references to the DOM nodes
        const containers = Array.from(scroller.querySelectorAll('.scroll-stack-card-container'));
        const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));

        cardsRef.current = cards;

        // Static measurement function
        const calculateOffsets = () => {
            const newOffsets = containers.map(container => {
                const rect = container.getBoundingClientRect();
                return rect.top + window.scrollY;
            });
            offsetsRef.current = newOffsets;

            // Apply spacing
            containers.forEach((container, i) => {
                if (i < containers.length - 1) {
                    container.style.marginBottom = `${itemDistance}px`;
                }
            });
        };

        // Initial setup
        calculateOffsets();
        updateCardTransforms();

        const handleScroll = () => {
            requestAnimationFrame(updateCardTransforms);
        };

        const handleResize = () => {
            calculateOffsets();
            updateCardTransforms();
        };

        // Event Listeners
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [itemDistance, updateCardTransforms]);

    return (
        <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
            <div className="scroll-stack-inner">
                {children}
                <div className="scroll-stack-end" style={{ height: '1px' }} />
            </div>
        </div>
    );
};

export default ScrollStack;
