import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Cylinder, Torus, Sphere } from '@react-three/drei'
import * as THREE from 'three'

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
            <Cylinder args={[0.8, 1.2, 2, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
            </Cylinder>

            {/* Lens */}
            <Cylinder args={[0.7, 0.7, 0.2, 32]} position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
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
                args={[0.7, 8, 40, 32]}
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

            {/* Mounting Bracket */}
            <Torus args={[0.5, 0.1, 8, 16]} position={[0, 0, -1]} rotation={[0, Math.PI / 2, 0]}>
                <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </Torus>

            {/* Point Light */}
            <pointLight position={[0, 0, 2]} color={color} intensity={2} distance={50} decay={2} />

            {/* Glow effect */}
            <Sphere args={[1, 16, 16]} position={[0, 0, 1]}>
                <meshBasicMaterial color={color} transparent opacity={0.1} />
            </Sphere>
        </group>
    )
}

export default function GlobalSpotlights() {
    return (
        <div className="fixed inset-0 pointer-events-none z-50" style={{ mixBlendMode: 'screen' }}>
            <Canvas
                camera={{ position: [0, 0, 30], fov: 50 }}
                style={{ pointerEvents: 'none' }}
            >
                <ambientLight intensity={0.2} />

                {/* Left Spotlight - Gold */}
                <ScrollingSpotlight
                    position={[-15, 10, -10]}
                    color="#FFD700"
                    side="left"
                />

                {/* Right Spotlight - Pink */}
                <ScrollingSpotlight
                    position={[15, 10, -10]}
                    color="#FF69B4"
                    side="right"
                />

                {/* Center Spotlight - Purple */}
                <ScrollingSpotlight
                    position={[0, 15, -15]}
                    color="#A78BFA"
                    side="center"
                />
            </Canvas>
        </div>
    )
}
