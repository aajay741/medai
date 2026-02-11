import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Image, Float } from '@react-three/drei'

export default function FloatingImagePlane({ url, position = [0, 0, 0], scale = [1, 1, 1] }) {
    const meshRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(time) * 0.005
        }
    })

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <Image
                ref={meshRef}
                url={url}
                position={position}
                scale={scale}
                transparent
                opacity={0.8}
            />
        </Float>
    )
}
