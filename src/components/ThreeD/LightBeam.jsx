import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder } from '@react-three/drei'
import * as THREE from 'three'

export default function LightBeam({ position = [0, 0, 0], length = 50, color = "#A78BFA", opacity = 0.05, tier = 2 }) {
    const ref = useRef()
    const isLowTier = tier === 0
    const isMidTier = tier === 1

    useFrame((state) => {
        if (isLowTier) return
        const time = state.clock.elapsedTime
        if (ref.current) {
            ref.current.rotation.y = Math.sin(time * 0.2) * 0.1
        }
    })

    if (isLowTier) return null // Save rendering on low tier

    const segments = isMidTier ? 8 : 12

    return (
        <group position={position}>
            <Cylinder ref={ref} args={[0.1, 5, length, segments, 1, true]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, length / 2]}>
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={opacity}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Cylinder>
        </group>
    )
}
