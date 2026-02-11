import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, Float } from '@react-three/drei'
import * as THREE from 'three'

function StackItem({ url, index, total, spread, progress }) {
    const meshRef = useRef()

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Calculate stacking position based on scroll progress or static index
            // Simple static offset for now, could be dynamic
            const targetZ = -index * spread + (progress * spread * 2)
            const targetY = -index * 0.5 + (progress * index * 0.1)

            meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 2)
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, delta * 2)

            // Fade out distant cards
            const dist = Math.abs(targetZ)
            meshRef.current.material.opacity = Math.max(0, 1 - (dist / 20))
        }
    })

    return (
        <Image
            ref={meshRef}
            url={url}
            position={[0, 0, -index * spread]}
            scale={[3, 2]}
            transparent
            opacity={1}
        />
    )
}

export default function GalleryStack({ images = [], spread = 2 }) {
    // This could hook into scroll progress context if needed
    const progress = 0

    return (
        <group>
            {images.map((img, i) => (
                <StackItem
                    key={i}
                    url={img}
                    index={i}
                    total={images.length}
                    spread={spread}
                    progress={progress}
                />
            ))}
        </group>
    )
}
