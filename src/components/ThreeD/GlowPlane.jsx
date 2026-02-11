import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import * as THREE from 'three'

export default function GlowPlane({ position = [0, 0, 0], scale = [10, 10, 1], color = "#A78BFA", opacity = 0.1 }) {
    const ref = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (ref.current) {
            ref.current.material.opacity = (Math.sin(time) * 0.5 + 0.5) * opacity
        }
    })

    return (
        <Plane ref={ref} position={position} scale={scale} args={[1, 1]}>
            <meshBasicMaterial
                color={color}
                transparent
                opacity={opacity}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Plane>
    )
}
