import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, MeshWobbleMaterial } from '@react-three/drei'

function Orb({ isLowQuality }) {
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

    const segments = isLowQuality ? 32 : 64

    return (
        <group>
            <Float speed={isLowQuality ? 1 : 3} rotationIntensity={isLowQuality ? 0.5 : 2} floatIntensity={isLowQuality ? 0.5 : 1}>
                <Sphere ref={meshRef} args={[2, segments, segments]}>
                    {isLowQuality ? (
                        <meshStandardMaterial
                            color="#A78BFA"
                            transparent
                            opacity={0.4}
                            emissive="#A78BFA"
                            emissiveIntensity={0.5}
                        />
                    ) : (
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
                    )}
                </Sphere>
            </Float>
            {!isLowQuality && (
                <Float speed={5} rotationIntensity={1} floatIntensity={2}>
                    <Sphere ref={innerRef} args={[1.2, 32, 32]}>
                        <MeshWobbleMaterial
                            color="#ffffff"
                            speed={1}
                            factor={0.4}
                            transparent
                            opacity={0.1}
                        />
                    </Sphere>
                </Float>
            )}
        </group>
    )
}

export default function ExperienceOrb({ isLowQuality }) {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 45 }}
                gl={{ antialias: !isLowQuality, powerPreference: 'high-performance' }}
                dpr={isLowQuality ? 1 : 1.2}
            >
                <ambientLight intensity={0.4} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="#A78BFA" intensity={0.5} />
                <Orb isLowQuality={isLowQuality} />
            </Canvas>
        </div>
    )
}
