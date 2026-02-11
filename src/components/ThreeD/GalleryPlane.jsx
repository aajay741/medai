import { useRef, useState } from 'react'
import { Image, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function GalleryPlane({ url, position = [0, 0, 0], scale = [1, 1.5], rotation = [0, 0, 0] }) {
    const ref = useRef()
    const [hovered, hover] = useState(false)
    useCursor(hovered)

    useFrame((state, delta) => {
        if (ref.current) {
            // Subtle floating motion
            ref.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.0005

            // Hover effect: smooth scale and brightness
            const targetScale = hovered ? 1.1 : 1
            ref.current.scale.x = THREE.MathUtils.lerp(ref.current.scale.x, scale[0] * targetScale, delta * 5)
            ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, scale[1] * targetScale, delta * 5)

            ref.current.material.grayscale = THREE.MathUtils.lerp(ref.current.material.grayscale, hovered ? 0 : 1, delta * 10)
            ref.current.material.zoom = THREE.MathUtils.lerp(ref.current.material.zoom, hovered ? 1 : 1.2, delta * 5)
        }
    })

    return (
        <Image
            ref={ref}
            url={url}
            position={position}
            scale={scale}
            rotation={rotation}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            transparent
            opacity={0.9}
            grayscale={1}
        />
    )
}
