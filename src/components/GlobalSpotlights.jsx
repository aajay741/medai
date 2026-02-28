import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Cylinder, Torus, Sphere } from '@react-three/drei'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'

const isMobileGlobal = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

function ScrollingSpotlight({ position = [0, 0, 0], color = "#FFD700", side = 'left' }) {
    const groupRef = useRef()
    const beamRef = useRef()
    const scrollY = useRef(0)

    useEffect(() => {
        const handleScroll = () => {
            scrollY.current = window.scrollY
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useFrame((state) => {
        if (!groupRef.current) return

        const time = state.clock.elapsedTime

        // Follow scroll position
        const targetY = position[1] + (scrollY.current * 0.02)
        groupRef.current.position.y = THREE.MathUtils.lerp(
            groupRef.current.position.y,
            targetY,
            0.05
        )

        // Gentle rotation
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.3
        groupRef.current.rotation.x = Math.cos(time * 0.3) * 0.2

        // Subtle sway
        const sway = side === 'left' ? 1 : -1
        groupRef.current.position.x = position[0] + Math.sin(time * 0.4) * 2 * sway
        groupRef.current.position.z = position[2]

        // Pulsing beam
        if (beamRef.current) {
            beamRef.current.material.opacity = 0.12 + Math.sin(time * 2) * 0.05
        }
    })

    return (
        <group ref={groupRef} position={position}>
            {/* Light Housing */}
            <Cylinder args={[0.8, 1.2, 2, 8]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
            </Cylinder>

            {/* Lens */}
            <Cylinder args={[0.7, 0.7, 0.2, 16]} position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.9}
                />
            </Cylinder>

            {/* Light Beam */}
            <Cylinder
                ref={beamRef}
                args={[0.7, 8, 40, 12]}
                position={[0, 0, 21]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                    depthWrite={false}
                />
            </Cylinder>

            {!isMobileGlobal && (
                <>
                    {/* Mounting Bracket */}
                    <Torus args={[0.5, 0.1, 6, 12]} position={[0, 0, -1]} rotation={[0, Math.PI / 2, 0]}>
                        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
                    </Torus>

                    {/* Point Light */}
                    <pointLight position={[0, 0, 2]} color={color} intensity={1.5} distance={30} decay={2} />
                </>
            )}
        </group>
    )
}

export default function GlobalSpotlights({ tier = 2 }) {
    // Only render spotlights on home page to save resources on other pages
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const isLowTier = tier === 0
    const isMidTier = tier === 1

    if (!isHomePage && (isMobileGlobal || isLowTier)) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-50" style={{ mixBlendMode: 'screen', opacity: (isMobileGlobal || isLowTier) ? 0.4 : 0.8 }}>
            <Canvas
                camera={{ position: [0, 0, 30], fov: 50 }}
                style={{ pointerEvents: 'none' }}
                gl={{ antialias: tier > 1 && !isMobileGlobal, powerPreference: 'high-performance' }}
                dpr={isMobileGlobal || isLowTier ? 0.8 : 1}
            >
                <ambientLight intensity={0.2} />

                {/* Left Spotlight - Gold */}
                <ScrollingSpotlight
                    position={[-15, 10, -10]}
                    color="#FFD700"
                    side="left"
                    tier={tier}
                />

                {/* Right Spotlight - Pink */}
                <ScrollingSpotlight
                    position={[15, 10, -10]}
                    color="#FF69B4"
                    side="right"
                    tier={tier}
                />

                {!isMobileGlobal && !isLowTier && (
                    <ScrollingSpotlight
                        position={[0, 15, -15]}
                        color="#A78BFA"
                        side="center"
                        tier={tier}
                    />
                )}
            </Canvas>
        </div>
    )
}
