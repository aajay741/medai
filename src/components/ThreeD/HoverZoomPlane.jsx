import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane, MeshWobbleMaterial, Text, Image } from '@react-three/drei'
import * as THREE from 'three'

function HoverImage({ url, position }) {
    const meshRef = useRef()
    const scale = useRef([1, 1, 1])
    const hovered = useRef(false)

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Smooth float
            meshRef.current.position.y = THREE.MathUtils.lerp(
                meshRef.current.position.y,
                hovered.current ? position[1] + 0.5 : position[1],
                delta * 2
            )
            meshRef.current.scale.lerp(
                new THREE.Vector3(...(hovered.current ? [1.2, 1.2, 1.2] : [1, 1, 1])),
                delta * 5
            )
        }
    })

    return (
        <group
            position={position}
            onPointerOver={() => (hovered.current = true)}
            onPointerOut={() => (hovered.current = false)}
        >
            <mesh ref={meshRef}>
                <Image
                    url={url}
                    transparent
                    opacity={0.9}
                    scale={hovered.current ? [3, 2, 1] : [2.5, 1.5, 1]}
                />
            </mesh>
            {hovered.current && (
                <Text
                    position={[0, -1.2, 0.1]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    View Project
                </Text>
            )}
        </group>
    )
}

export default function HoverZoomPlane({ images }) {
    return (
        <group>
            {images.map((img, i) => (
                <HoverImage key={i} url={img.url} position={[img.x, img.y, img.z]} />
            ))}
        </group>
    )
}
