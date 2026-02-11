import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, MeshDistortMaterial, Text } from '@react-three/drei'

export default function ScrollProgressIndicator3D({ scrollProgressRef }) {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            const progress = scrollProgressRef.current || 0

            // Subtle rotation based on scroll speed
            meshRef.current.rotation.y += delta * 0.5 + progress * 0.1

            // Pulse scale based on current scroll position
            meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05 + progress * 0.2)

            // Color shift based on progress could be implemented
        }
    })

    return (
        <group position={[0, -10, 0]}> {/* Adjust position to be visible at bottom */}
            <Cylinder ref={meshRef} args={[0.5, 0.5, 0.1, 32]}>
                <MeshDistortMaterial
                    color="#A78BFA"
                    emissive="#A78BFA"
                    emissiveIntensity={2}
                    speed={2}
                    distort={0.4}
                />
            </Cylinder>
        </group>
    )
}
