import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

export default function IdleDrift({ children, speed, range }) {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            const time = state.clock.elapsedTime
            // Slow, subtle perlin-like drift
            meshRef.current.position.x = Math.sin(time * speed * 0.5) * range
            meshRef.current.position.y = Math.cos(time * speed * 0.3) * range * 0.5
            meshRef.current.rotation.z = Math.sin(time * speed * 0.1) * 0.05
        }
    })

    return <group ref={meshRef}>{children}</group>
}
