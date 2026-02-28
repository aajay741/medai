import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'

export default function SoundWave({ position = [0, 0, 0], color = "#A78BFA", tier = 2 }) {
    const groupRef = useRef()
    const isLowTier = tier === 0
    const isMidTier = tier === 1

    useFrame((state) => {
        if (isLowTier) return // Save CPU on low tier
        const time = state.clock.elapsedTime
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.3
        }
    })

    const waveCount = isLowTier ? 1 : (isMidTier ? 2 : 4)

    return (
        <group ref={groupRef} position={position}>
            {/* Concentric Sound Waves */}
            {[...Array(waveCount)].map((_, i) => (
                <Sphere key={i} args={[(i + 1) * 2, isLowTier ? 12 : 16, isLowTier ? 12 : 16]}>
                    {isLowTier || isMidTier ? (
                        <meshStandardMaterial
                            color={color}
                            transparent
                            opacity={0.15 - i * 0.03}
                            wireframe
                        />
                    ) : (
                        <MeshDistortMaterial
                            color={color}
                            transparent
                            opacity={0.15 - i * 0.03}
                            distort={0.4}
                            speed={2 + i}
                            wireframe
                        />
                    )}
                </Sphere>
            ))}

            {/* Central Pulse */}
            <Sphere args={[0.5, isLowTier ? 8 : 16, isLowTier ? 8 : 16]}>
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2}
                    transparent
                    opacity={0.8}
                />
            </Sphere>
        </group>
    )
}
