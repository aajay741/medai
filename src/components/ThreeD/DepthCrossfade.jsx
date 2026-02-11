import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function DepthCrossfade({ direction = 1, opacity = 1 }) {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Smooth zoom out/in effect
            meshRef.current.position.z += direction * delta * 2

            // Fade logic based on opacity or parent control
            meshRef.current.material.opacity = Math.max(0, THREE.MathUtils.lerp(meshRef.current.material.opacity, opacity, 0.1))
        }
    })

    return (
        <Plane ref={meshRef} position={[0, 0, -20]} args={[50, 50]}>
            <MeshWobbleMaterial
                color="#030303"
                transparent
                opacity={opacity}
                factor={0.1}
                speed={2}
                depthWrite={false}
            />
        </Plane>
    )
}
