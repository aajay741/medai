import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, MeshWobbleMaterial } from '@react-three/drei'

function Orb() {
    const meshRef = useRef()
    const innerRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.y = time * 0.2
            meshRef.current.rotation.z = time * 0.1
        }
        if (innerRef.current) {
            innerRef.current.rotation.y = -time * 0.4
        }
    })

    return (
        <group>
            <Float speed={3} rotationIntensity={2} floatIntensity={1}>
                <Sphere ref={meshRef} args={[2, 64, 64]}>
                    <MeshDistortMaterial
                        color="#A78BFA"
                        speed={3}
                        distort={0.6}
                        radius={1}
                        emissive="#A78BFA"
                        emissiveIntensity={0.2}
                        transparent
                        opacity={0.3}
                    />
                </Sphere>
            </Float>
            <Float speed={5} rotationIntensity={1} floatIntensity={2}>
                <Sphere ref={innerRef} args={[1.2, 64, 64]}>
                    <MeshWobbleMaterial
                        color="#ffffff"
                        speed={1}
                        factor={0.4}
                        transparent
                        opacity={0.1}
                    />
                </Sphere>
            </Float>
        </group>
    )
}

export default function ExperienceOrb() {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="#A78BFA" intensity={0.5} />
                <Orb />
            </Canvas>
        </div>
    )
}
