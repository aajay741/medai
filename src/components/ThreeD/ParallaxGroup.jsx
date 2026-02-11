import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'

export default function ParallaxGroup({ children, speed, distance }) {
    const groupRef = useRef()
    const lastScroll = useRef(0)

    useFrame((state, delta) => {
        if (groupRef.current) {
            const scroll = window.scrollY // In a real setup, use a scroll store or hook like useLenis/useScroll
            const yOffset = (scroll - lastScroll.current) * speed
            lastScroll.current = scroll

            groupRef.current.position.y += yOffset * delta
        }
    })

    return <group ref={groupRef} position={[0, distance, 0]}>{children}</group>
}
