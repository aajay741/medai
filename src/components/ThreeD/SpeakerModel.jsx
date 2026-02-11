import { useRef } from 'react'
import { Box, Cylinder, Sphere } from '@react-three/drei'

export default function SpeakerModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Cabinet */}
            <Box args={[1.5, 2.5, 1.2]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
            </Box>

            {/* Front Grill/Mesh area */}
            <Box args={[1.3, 2.3, 0.1]} position={[0, 0, 0.6]}>
                <meshStandardMaterial color="#050505" />
            </Box>

            {/* Large Woofer (Bottom) */}
            <group position={[0, -0.6, 0.65]}>
                <Cylinder args={[0.5, 0.5, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#222" metalness={0.8} />
                </Cylinder>
                <Sphere args={[0.15, 16, 16]} position={[0, 0, 0.05]}>
                    <meshStandardMaterial color="#1a1a1a" />
                </Sphere>
            </group>

            {/* Tweeter (Top) */}
            <group position={[0, 0.6, 0.65]}>
                <Cylinder args={[0.3, 0.3, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color="#222" metalness={0.8} />
                </Cylinder>
                <Sphere args={[0.08, 16, 16]} position={[0, 0, 0.05]}>
                    <meshStandardMaterial color="#1a1a1a" />
                </Sphere>
            </group>

            {/* Ports/Details */}
            <Cylinder args={[0.1, 0.1, 0.1, 16]} rotation={[Math.PI / 2, 0, 0]} position={[0.4, 1, 0.65]}>
                <meshStandardMaterial color="#000" />
            </Cylinder>
        </group>
    )
}
