import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder, Sphere, Torus } from '@react-three/drei'
import * as THREE from 'three'

export default function StageLight({ position = [0, 0, 0], color = "#FFD700", intensity = 1 }) {
    const lightRef = useRef()
    const beamRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (lightRef.current) {
            lightRef.current.rotation.y = Math.sin(time * 0.5) * 0.3
            lightRef.current.rotation.x = Math.cos(time * 0.3) * 0.2
        }
        if (beamRef.current) {
            beamRef.current.material.opacity = 0.1 + Math.sin(time * 2) * 0.05
        }
    })

    return (
        <group position={position} ref={lightRef}>
            {/* Light Housing */}
            <Cylinder args={[0.8, 1.2, 2, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
            </Cylinder>

            {/* Lens */}
            <Cylinder args={[0.7, 0.7, 0.2, 32]} position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} transparent opacity={0.8} />
            </Cylinder>

            {/* Light Beam */}
            <Cylinder ref={beamRef} args={[0.7, 8, 40, 32]} position={[0, 0, 21]} rotation={[Math.PI / 2, 0, 0]}>
                <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
            </Cylinder>

            {/* Mounting Bracket */}
            <Torus args={[0.5, 0.1, 8, 16]} position={[0, 0, -1]} rotation={[0, Math.PI / 2, 0]}>
                <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
            </Torus>

            {/* Point Light */}
            <pointLight position={[0, 0, 2]} color={color} intensity={intensity * 2} distance={50} decay={2} />
        </group>
    )
}
