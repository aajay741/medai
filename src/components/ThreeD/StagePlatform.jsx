import { useRef } from 'react'
import { Cylinder, MeshReflectorMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

export default function StagePlatform({ position = [0, -5, 0], radius = 20 }) {
    return (
        <group position={position}>
            <Cylinder args={[radius, radius + 2, 1, 64]} position={[0, -0.5, 0]}>
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={40}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"
                    metalness={0.5}
                />
            </Cylinder>

            {/* Subtle under-glow ring */}
            <Cylinder args={[radius + 0.5, radius + 0.5, 0.1, 64]} position={[0, -1, 0]}>
                <meshBasicMaterial color="#A78BFA" transparent opacity={0.1} />
            </Cylinder>
        </group>
    )
}
