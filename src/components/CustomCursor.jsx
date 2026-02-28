import { useEffect, useRef } from 'react'

export default function CustomCursor({ tier = 2 }) {
    const dotRef = useRef(null)
    const ringRef = useRef(null)
    const auraRef = useRef(null)

    useEffect(() => {
        if (tier === 0) return // Disable on low tier

        let mouseX = 0
        let mouseY = 0
        let dotX = 0
        let dotY = 0
        let ringX = 0
        let ringY = 0
        let auraX = 0
        let auraY = 0

        const handleMouseMove = (e) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }

        const handleMouseOver = (e) => {
            const target = e.target
            const isClickable = target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer')

            if (isClickable) {
                if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(2.5)`
                if (ringRef.current) ringRef.current.style.opacity = '0.3'
            } else {
                if (ringRef.current) ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) scale(1)`
                if (ringRef.current) ringRef.current.style.opacity = '0.6'
            }
        }

        const animate = () => {
            // Instant Dot (1:1 with mouse)
            dotX = mouseX
            dotY = mouseY
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`
            }

            // High-speed Ring (Fast Lerp)
            ringX += (mouseX - ringX) * (tier === 1 ? 0.4 : 0.25) // Faster on mid tier to feel responsive
            ringY += (mouseY - ringY) * (tier === 1 ? 0.4 : 0.25)
            if (ringRef.current) {
                const currentScale = ringRef.current.style.transform.includes('scale(2.5)') ? 'scale(2.5)' : 'scale(1)'
                ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) ${currentScale}`
            }

            // Aura (Slow Lerp) - Only on high tier
            if (tier > 1) {
                auraX += (mouseX - auraX) * 0.05
                auraY += (mouseY - auraY) * 0.05
                if (auraRef.current) {
                    auraRef.current.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`
                }
            }

            requestAnimationFrame(animate)
        }

        window.addEventListener('mousemove', handleMouseMove, { passive: true })
        window.addEventListener('mouseover', handleMouseOver)
        const animationId = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleMouseOver)
            cancelAnimationFrame(animationId)
        }
    }, [tier])

    if (tier === 0) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
            {/* Main Cursor Dot */}
            <div
                ref={dotRef}
                style={{ position: 'absolute', top: 0, left: 0, marginTop: '-4px', marginLeft: '-4px', opacity: 0.8, willChange: 'transform' }}
                className="w-2 h-2 bg-[#A78BFA] rounded-full shadow-[0_0_15px_rgba(167,139,250,1)]"
            />

            {/* Trailing Ring */}
            <div
                ref={ringRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    marginTop: '-20px',
                    marginLeft: '-20px',
                    transition: 'opacity 0.3s ease, transform 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
                    willChange: 'transform'
                }}
                className="w-10 h-10 border border-[#A78BFA]/40 rounded-full opacity-60"
            />

            {/* Glow Aura - Conditional */}
            {tier > 1 && (
                <div
                    ref={auraRef}
                    style={{ position: 'absolute', top: 0, left: 0, marginTop: '-128px', marginLeft: '-128px', opacity: 0.05, willChange: 'transform' }}
                    className="w-64 h-64 bg-[#A78BFA] blur-[80px] rounded-full"
                />
            )}
        </div>
    )
}
