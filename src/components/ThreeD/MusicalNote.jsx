import { useRef } from 'react'
import { Sphere, Cylinder, MeshDistortMaterial, Float } from '@react-three/drei'

export default function MusicalNote({ position = [0, 0, 0], color = "#A78BFA" }) {
    return (
        <group position={position}>
            {/* Note Head */}
            <Sphere args={[0.4, 32, 32]} scale={[1.2, 1, 0.8]} rotation={[0, 0, 0.2]}>
                <MeshDistortMaterial
                    color={color}
                    speed={2}
                    distort={0.3}
                    emissive={color}
                    emissiveIntensity={1}
                />
            </Sphere>

            {/* Note Stem */}
            <Cylinder args={[0.05, 0.05, 1.5, 16]} position={[0.4, 0.75, 0]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </Cylinder>

            {/* Note Flag */}
            <Cylinder args={[0.05, 0.05, 0.8, 16]} position={[0.7, 1.4, 0]} rotation={[0, 0, Math.PI / 3]}>
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
            </Cylinder>
        </group>
    )
}
