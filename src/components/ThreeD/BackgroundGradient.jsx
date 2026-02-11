import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane, GradientTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function BackgroundGradient({ colors = ["#000000", "#111111", "#000000"] }) {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Very slow, subtle drift or shift?
            // meshRef.current.material.userData.uTime.value += delta
        }
    })

    return (
        <Plane args={[100, 100]} position={[0, 0, -50]}>
            <meshBasicMaterial>
                <GradientTexture
                    stops={[0, 0.5, 1]}
                    colors={colors}
                    size={1024}
                />
            </meshBasicMaterial>
        </Plane>
    )
}
