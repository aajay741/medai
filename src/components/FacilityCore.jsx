import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Octahedron } from '@react-three/drei'

function Core() {
    const meshRef = useRef()
    const wireRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.y = time * 0.5
            meshRef.current.rotation.x = time * 0.2
        }
        if (wireRef.current) {
            wireRef.current.rotation.y = -time * 0.3
            wireRef.current.rotation.z = time * 0.4
        }
    })

    return (
        <group>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Octahedron ref={meshRef} args={[2, 0]}>
                    <MeshDistortMaterial
                        color="#A78BFA"
                        speed={2}
                        distort={0.3}
                        radius={1}
                        emissive="#A78BFA"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.9}
                    />
                </Octahedron>
            </Float>
            <Float speed={4} rotationIntensity={2} floatIntensity={2}>
                <Octahedron ref={wireRef} args={[2.5, 0]}>
                    <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
                </Octahedron>
            </Float>
        </group>
    )
}

export default function FacilityCore() {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} color="#A78BFA" intensity={1} />
                <Core />
            </Canvas>
        </div>
    )
}
