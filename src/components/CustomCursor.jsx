import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CustomCursor() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    const springConfig = { damping: 20, stiffness: 200 }
    const cursorX = useSpring(0, springConfig)
    const cursorY = useSpring(0, springConfig)

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY })
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
        }

        const handleMouseOver = (e) => {
            const target = e.target
            if (
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true)
            } else {
                setIsHovering(false)
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [cursorX, cursorY])

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
            {/* Main Cursor Dot */}
            <motion.div
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="w-2 h-2 bg-[#A78BFA] rounded-full shadow-[0_0_10px_rgba(167,139,250,1)]"
            />

            {/* Trailing Ring */}
            <motion.div
                animate={{
                    x: mousePos.x,
                    y: mousePos.y,
                    scale: isHovering ? 2.5 : 1,
                    opacity: isHovering ? 0.3 : 0.6,
                }}
                transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="absolute top-0 left-0 w-10 h-10 border border-[#A78BFA]/30 rounded-full"
            />

            {/* Glow Aura */}
            <motion.div
                animate={{
                    x: mousePos.x,
                    y: mousePos.y,
                }}
                transition={{ type: 'spring', damping: 40, stiffness: 100 }}
                style={{
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="absolute top-0 left-0 w-64 h-64 bg-[#A78BFA]/[0.03] blur-[60px] rounded-full"
            />
        </div>
    )
}
