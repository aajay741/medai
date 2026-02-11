import { useRef } from 'react'
import { Box, Cylinder, Torus, Html } from '@react-three/drei'

export default function CameraModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = "#222" }) {
    return (
        <group position={position} rotation={rotation} scale={scale}>
            {/* Body */}
            <Box args={[1, 1.2, 2]} position={[0, 0, 0]}>
                <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </Box>

            {/* Top Handle */}
            <Box args={[0.2, 0.5, 1.5]} position={[0, 0.85, 0]}>
                <meshStandardMaterial color="#111" />
            </Box>

            {/* Lens Base */}
            <Cylinder args={[0.6, 0.6, 0.5, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.25]}>
                <meshStandardMaterial color="#111" />
            </Cylinder>

            {/* Lens Glass */}
            <Cylinder args={[0.5, 0.4, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.5]}>
                <meshStandardMaterial color="#333" />
            </Cylinder>
            <Cylinder args={[0.45, 0.45, 0.05, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 1.6]}>
                <meshStandardMaterial color="#000" metalness={1} roughness={0} />
            </Cylinder>

            {/* Side Display */}
            <Box args={[0.1, 0.8, 1.2]} position={[0.55, 0, -0.2]}>
                <meshStandardMaterial color="#1a1a1a" />
            </Box>

            {/* Battery Pack */}
            <Box args={[0.9, 0.8, 0.5]} position={[0, -0.1, -1.25]}>
                <meshStandardMaterial color="#333" />
            </Box>

            {/* Red Record Light */}
            <Box args={[0.1, 0.1, 0.1]} position={[0.4, 0.4, 1.05]}>
                <meshBasicMaterial color="#ff0000" />
            </Box>
        </group>
    )
}
