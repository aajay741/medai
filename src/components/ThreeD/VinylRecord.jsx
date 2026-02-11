import { useRef } from 'react'
import { Cylinder, Torus, Box } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function VinylRecord({ position = [0, 0, 0] }) {
    const recordRef = useRef()

    useFrame((state) => {
        if (recordRef.current) {
            recordRef.current.rotation.y += 0.05
        }
    })

    return (
        <group position={position}>
            {/* Record Player Base */}
            <Box args={[4, 0.4, 4]} position={[0, -0.3, 0]}>
                <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
            </Box>

            {/* The Record */}
            <group ref={recordRef} position={[0, 0, 0]}>
                <Cylinder args={[1.8, 1.8, 0.05, 64]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#050505" metalness={1} roughness={0.2} stroke="#333" />
                </Cylinder>
                {/* Grooves simulation (using Torus) */}
                {[...Array(5)].map((_, i) => (
                    <Torus key={i} args={[0.5 + i * 0.25, 0.005, 2, 64]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
                        <meshBasicMaterial color="#333" transparent opacity={0.3} />
                    </Torus>
                ))}
                {/* Label */}
                <Cylinder args={[0.4, 0.4, 0.06, 32]} position={[0, 0, 0]}>
                    <meshStandardMaterial color="#A78BFA" />
                </Cylinder>
            </group>

            {/* Tonearm */}
            <group position={[1.5, 0, -1.5]}>
                <Cylinder args={[0.05, 0.05, 0.5, 16]} position={[0, 0.25, 0]}>
                    <meshStandardMaterial color="#333" />
                </Cylinder>
                <Cylinder args={[0.02, 0.02, 2, 16]} position={[-0.7, 0.5, 0.7]} rotation={[0, -Math.PI / 4, Math.PI / 2]}>
                    <meshStandardMaterial color="#666" metalness={1} />
                </Cylinder>
            </group>
        </group>
    )
}
