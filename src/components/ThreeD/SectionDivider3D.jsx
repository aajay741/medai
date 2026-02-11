import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line } from '@react-three/drei'
import * as THREE from 'three'

export default function SectionDivider3D({ position = [0, -10, 0] }) {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.05
        }
    })

    return (
        <group position={position}>
            {/* Horizontal Divider Line */}
            <Line
                ref={meshRef}
                points={[[-50, 0, 0], [50, 0, 0]]}
                lineWidth={0.5}
                color="#A78BFA"
                transparent
                opacity={0.3}
            />
            {/* Pulsing Dots at ends */}
            <group position={[-50, 0, 0]}>
                <mesh>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshBasicMaterial color="#A78BFA" />
                </mesh>
            </group>
            <group position={[50, 0, 0]}>
                <mesh>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshBasicMaterial color="#A78BFA" />
                </mesh>
            </group>
        </group>
    )
}
