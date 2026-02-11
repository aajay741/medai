import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

export default function FloatMotion({ children, speed = 1, rotation = 1, float = 1 }) {
    return (
        <Float
            speed={speed * 2}
            rotationIntensity={rotation}
            floatIntensity={float}
        >
            {children}
        </Float>
    )
}
