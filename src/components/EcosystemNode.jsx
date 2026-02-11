import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'

function Node3D({ color = "#A78BFA" }) {
    const meshRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.x = time * 0.5
            meshRef.current.rotation.y = time * 0.3
        }
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1.5, 32, 32]}>
                <MeshDistortMaterial
                    color={color}
                    speed={2}
                    distort={0.4}
                    radius={1}
                    emissive={color}
                    emissiveIntensity={0.2}
                    transparent
                    opacity={0.6}
                />
            </Sphere>
        </Float>
    )
}

export default function EcosystemNode() {
    return (
        <div className="w-full h-full min-h-[200px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Node3D />
            </Canvas>
        </div>
    )
}
