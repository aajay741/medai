import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'

export default function SoundWave({ position = [0, 0, 0], color = "#A78BFA" }) {
    const groupRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.3
        }
    })

    return (
        <group ref={groupRef} position={position}>
            {/* Concentric Sound Waves */}
            {[1, 2, 3, 4].map((scale, i) => (
                <Sphere key={i} args={[scale * 2, 32, 32]}>
                    <MeshDistortMaterial
                        color={color}
                        transparent
                        opacity={0.15 - i * 0.03}
                        distort={0.4}
                        speed={2 + i}
                        wireframe
                    />
                </Sphere>
            ))}

            {/* Central Pulse */}
            <Sphere args={[0.5, 32, 32]}>
                <MeshDistortMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={2}
                    distort={0.6}
                    speed={5}
                    transparent
                    opacity={0.8}
                />
            </Sphere>
        </group>
    )
}
