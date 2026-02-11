import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cylinder } from '@react-three/drei'

export default function Curtain({ position = [0, 0, 0], open = false }) {
    const leftRef = useRef()
    const rightRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        const targetX = open ? -8 : 0

        if (leftRef.current) {
            leftRef.current.position.x += (targetX - leftRef.current.position.x) * 0.05
            leftRef.current.position.y = Math.sin(time + leftRef.current.position.x) * 0.1
        }
        if (rightRef.current) {
            rightRef.current.position.x += (-targetX - rightRef.current.position.x) * 0.05
            rightRef.current.position.y = Math.sin(time + rightRef.current.position.x) * 0.1
        }
    })

    return (
        <group position={position}>
            {/* Curtain Rod */}
            <Cylinder args={[0.1, 0.1, 20, 16]} position={[0, 8, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#8B7355" metalness={0.8} roughness={0.2} />
            </Cylinder>

            {/* Left Curtain */}
            <group ref={leftRef}>
                <Box args={[7, 15, 0.5]} position={[-3.5, 0, 0]}>
                    <meshStandardMaterial color="#8B0000" roughness={0.8} />
                </Box>
                {/* Folds */}
                {[...Array(6)].map((_, i) => (
                    <Box key={i} args={[0.3, 15, 0.6]} position={[-6.5 + i * 1.3, 0, 0.3]}>
                        <meshStandardMaterial color="#6B0000" roughness={0.9} />
                    </Box>
                ))}
            </group>

            {/* Right Curtain */}
            <group ref={rightRef}>
                <Box args={[7, 15, 0.5]} position={[3.5, 0, 0]}>
                    <meshStandardMaterial color="#8B0000" roughness={0.8} />
                </Box>
                {/* Folds */}
                {[...Array(6)].map((_, i) => (
                    <Box key={i} args={[0.3, 15, 0.6]} position={[0.5 + i * 1.3, 0, 0.3]}>
                        <meshStandardMaterial color="#6B0000" roughness={0.9} />
                    </Box>
                ))}
            </group>
        </group>
    )
}
