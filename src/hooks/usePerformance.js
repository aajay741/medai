import { useState, useEffect, useRef } from 'react'

/**
 * usePerformance hook to monitor FPS and adjust quality tiers.
 * Quality Tiers: 0 (Low), 1 (Medium), 2 (High)
 */
export function usePerformance() {
    // Detect mobile device to force low tier immediately
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
    const [tier, setTier] = useState(isMobile ? 0 : 2)
    const fpsRef = useRef(60)
    const framesRef = useRef(0)
    const lastTimeRef = useRef(performance.now())
    const lowFpsCounterRef = useRef(0)

    useEffect(() => {
        let rafId

        const checkFps = (time) => {
            framesRef.current++
            const delta = time - lastTimeRef.current

            if (delta >= 1000) {
                const fps = Math.round((framesRef.current * 1000) / delta)
                fpsRef.current = fps
                framesRef.current = 0
                lastTimeRef.current = time

                // Adaptive downgrading (more aggressive on non-mobile)
                if (fps < 35) {
                    lowFpsCounterRef.current++
                    if (lowFpsCounterRef.current > (isMobile ? 1 : 3)) { // Faster downgrade on mobile
                        setTier(prev => Math.max(0, prev - 1))
                        lowFpsCounterRef.current = 0
                    }
                } else if (fps > 55) {
                    lowFpsCounterRef.current = 0
                    // On desktop, we can try to upgrade back up if performance is stellar
                    if (!isMobile && fps > 58 && tier < 2) {
                        // Optional: Upgrade logic if needed
                    }
                }
            }

            rafId = requestAnimationFrame(checkFps)
        }

        rafId = requestAnimationFrame(checkFps)
        return () => cancelAnimationFrame(rafId)
    }, [isMobile, tier])

    return { tier, fps: fpsRef.current, isMobile }
}
