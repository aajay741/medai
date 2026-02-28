import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Float, Octahedron } from '@react-three/drei'

function Core({ tier = 2 }) {
    const meshRef = useRef()
    const wireRef = useRef()
    const isLowTier = tier === 0
    const isMidTier = tier === 1

    useFrame((state) => {
        if (isLowTier) return
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

    if (isLowTier) return (
        <Octahedron ref={meshRef} args={[2, 0]}>
            <meshStandardMaterial color="#A78BFA" transparent opacity={0.6} />
        </Octahedron>
    )

    return (
        <group>
            <Float speed={tier > 1 ? 2 : 0} rotationIntensity={tier > 1 ? 1 : 0} floatIntensity={tier > 1 ? 1 : 0}>
                <Octahedron ref={meshRef} args={[2, 0]}>
                    {tier > 1 ? (
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
                    ) : (
                        <meshStandardMaterial
                            color="#A78BFA"
                            emissive="#A78BFA"
                            emissiveIntensity={0.5}
                            transparent
                            opacity={0.8}
                        />
                    )}
                </Octahedron>
            </Float>
            {!isLowTier && (
                <Float speed={tier > 1 ? 4 : 0} rotationIntensity={tier > 1 ? 2 : 0} floatIntensity={tier > 1 ? 2 : 0}>
                    <Octahedron ref={wireRef} args={[2.5, 0]}>
                        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
                    </Octahedron>
                </Float>
            )}
        </group>
    )
}

export default function FacilityCore({ tier = 2 }) {
    if (tier === 0) return null // Disable complex 3D on low tier

    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 45 }}
                gl={{ antialias: tier > 1, powerPreference: 'high-performance' }}
                dpr={tier > 1 ? [1, 1.5] : 1}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, -10, -10]} color="#A78BFA" intensity={1} />
                <Core tier={tier} />
            </Canvas>
        </div>
    )
}
