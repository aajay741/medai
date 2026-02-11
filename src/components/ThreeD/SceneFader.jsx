import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'

export default function SceneFader({ opacity = 0 }) {
    const meshRef = useRef()

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.material.opacity = THREE.MathUtils.lerp(meshRef.current.material.opacity, opacity, 0.1)
        }
    })

    return (
        <Plane ref={meshRef} args={[100, 100]} position={[0, 0, 5]}>
            <meshBasicMaterial color="#030303" transparent opacity={1} depthTest={false} />
        </Plane>
    )
}
