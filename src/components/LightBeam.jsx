import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function LightBeam({ position, color = "#A78BFA", opacity = 0.2, scale = [1, 1, 1] }) {
    const meshRef = useRef()
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
        }
    })

    return (
        <mesh position={position} rotation={[0, 0, 0]} scale={scale} ref={meshRef}>
            <cylinderGeometry args={[0, 5, 20, 32, 1, true]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={opacity}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    )
}
