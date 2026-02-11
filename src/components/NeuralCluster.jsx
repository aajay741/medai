import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'

function Orb({ color = "#A78BFA", position }) {
    const meshRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(time + position[0]) * 0.002
            meshRef.current.scale.setScalar(1 + Math.sin(time * 2 + position[1]) * 0.1)
        }
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Sphere ref={meshRef} position={position} args={[1.5, 32, 32]}>
                <MeshDistortMaterial
                    color={color}
                    speed={2}
                    distort={0.4}
                    radius={1}
                    emissive={color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.8}
                />
            </Sphere>
        </Float>
    )
}

export default function NeuralCluster() {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <group>
                    <Orb position={[-3, 2, 0]} color="#A78BFA" />
                    <Orb position={[3, -1, -2]} color="#ffffff" />
                    <Orb position={[0, -3, 2]} color="#A78BFA" />
                </group>
            </Canvas>
        </div>
    )
}
