import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Cylinder, Box, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function MicModel({ scrollProgress }) {
    const groupRef = useRef()
    const ringsRef = useRef()

    // Abstract Theater/Stage elements mapped to 9 sections
    // Stage 0: Hero
    // Stage 1: Intro
    // Stage 2: Stats
    // Stage 3: Venues
    // Stage 4: Facilities
    // Stage 5: Experience (New)
    // Stage 6: Quote
    // Stage 7: Gallery
    // Stage 8: Contact

    const elements = useMemo(() => [
        { type: 'portal', pos: [0, 5, 0], rot: [0, 0, 0], scale: 1.5, color: '#ffffff', stage: 0 },

        { type: 'pillar', pos: [-15, -25, -10], rot: [0, 0.5, 0], scale: 1, color: '#ffffff', stage: 1 },
        { type: 'cable', pos: [-15, -25, -10], rot: [0, 0, 0.1], scale: 1, stage: 1 },

        { type: 'data_cluster', pos: [8, -60, 0], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 2 },

        { type: 'lattice', pos: [-18, -100, -15], rot: [0.1, 0.4, 0.2], scale: 5, color: '#ffffff', stage: 3 },

        { type: 'heavy_rig', pos: [0, -145, -12], rot: [Math.PI / 2, 0, 0], scale: 2, color: '#ffffff', stage: 4 },

        // Experience: Floating Waves / Pulsing Strings
        { type: 'waves', pos: [0, -185, -5], rot: [0, 0, 0], scale: 3, color: '#ffffff', stage: 5 },

        { type: 'super_core', pos: [0, -225, -2], rot: [0, 0, 0], scale: 1.2, color: '#ffffff', stage: 6 },

        { type: 'optical_assembly', pos: [-12, -265, -5], rot: [0, 0.8, 0], scale: 2.5, color: '#ffffff', stage: 7 },

        { type: 'beacon', pos: [0, -320, 0], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 8 }
    ], [])

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.1
        }
        if (ringsRef.current) {
            ringsRef.current.rotation.z = time * 0.2
        }
    })

    return (
        <group ref={groupRef}>
            {elements.map((el, i) => (
                <FloatStageElement key={i} element={el} scrollProgress={scrollProgress} />
            ))}

            <group ref={ringsRef} position={[0, -180, -20]}>
                {[...Array(6)].map((_, i) => (
                    <Torus key={i} args={[50 + i * 15, 0.01, 16, 120]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
                    </Torus>
                ))}
            </group>

            <PointsBuffer />
            <StageGlobalBeams scrollProgress={scrollProgress} />
        </group>
    )
}

function FloatStageElement({ element, scrollProgress }) {
    const meshRef = useRef()

    // Now 9 stages, so 1/9 = 0.111
    const sectionIndex = element.stage
    const sectionStart = sectionIndex * 0.111

    useFrame((state) => {
        if (!meshRef.current) return
        const time = state.clock.elapsedTime
        const dist = Math.abs(scrollProgress - sectionStart)
        const active = Math.max(0, 1 - dist * 9)

        meshRef.current.rotation.y += 0.005 + active * 0.03
        meshRef.current.position.y += Math.sin(time + element.stage) * 0.01

        const s = element.scale * (1 + active * 0.4)
        meshRef.current.scale.set(s, s, s)
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1} position={element.pos}>
            <group ref={meshRef} rotation={element.rot}>
                {element.type === 'portal' && (
                    <Torus args={[4, 0.05, 16, 100]}>
                        <meshStandardMaterial color={element.color} emissive={element.color} emissiveIntensity={0.2} transparent opacity={0.3} />
                    </Torus>
                )}
                {element.type === 'pillar' && (
                    <Box args={[1, 50, 1]}>
                        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} transparent opacity={0.2} />
                    </Box>
                )}
                {element.type === 'cable' && (
                    <Cylinder args={[0.02, 0.02, 100, 8]} rotation={[0, 0, Math.PI / 2]}>
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
                    </Cylinder>
                )}
                {element.type === 'data_cluster' && (
                    <group>
                        {[...Array(12)].map((_, i) => (
                            <Box key={i} args={[0.4, 0.4, 0.4]} position={[Math.sin(i) * 4, Math.cos(i) * 4, Math.sin(i * 2) * 2]}>
                                <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
                            </Box>
                        ))}
                    </group>
                )}
                {element.type === 'lattice' && (
                    <Box args={[1, 1, 1]}>
                        <meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.2} />
                    </Box>
                )}
                {element.type === 'heavy_rig' && (
                    <Torus args={[6, 0.15, 16, 8]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} transparent opacity={0.4} />
                    </Torus>
                )}
                {element.type === 'waves' && (
                    <group>
                        {[...Array(20)].map((_, i) => (
                            <Cylinder key={i} args={[0.005, 0.005, 50, 8]} position={[i - 10, 0, 0]}>
                                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
                            </Cylinder>
                        ))}
                    </group>
                )}
                {element.type === 'super_core' && (
                    <Sphere args={[2, 64, 64]}>
                        <MeshDistortMaterial color="#ffffff" speed={3} distort={0.5} radius={1} transparent opacity={0.2} />
                    </Sphere>
                )}
                {element.type === 'optical_assembly' && (
                    <group>
                        <Torus args={[3, 0.1, 16, 80]} />
                        <Torus args={[2.8, 0.02, 16, 100]} position={[0, 0, 1]} />
                    </group>
                )}
                {element.type === 'beacon' && (
                    <group>
                        <Sphere args={[0.5, 32, 32]}>
                            <meshBasicMaterial color="#ffffff" />
                        </Sphere>
                        <Cylinder args={[0, 10, 300, 32]} position={[0, -150, 0]} rotation={[Math.PI, 0, 0]}>
                            <meshBasicMaterial color="#ffffff" transparent opacity={0.04} />
                        </Cylinder>
                    </group>
                )}
            </group>
        </Float>
    )
}

function StageGlobalBeams({ scrollProgress }) {
    return (
        <group>
            {[...Array(12)].map((_, i) => (
                <Cylinder
                    key={i}
                    args={[0.02, 15, 1000, 32]}
                    position={[Math.sin(i) * 60, -500, Math.cos(i) * 60]}
                    rotation={[Math.PI * 0.08, 0, (i - 6) * 0.1]}
                >
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.008} />
                </Cylinder>
            ))}
        </group>
    )
}

function PointsBuffer() {
    const count = 10000
    const points = useMemo(() => {
        const p = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 250
            p[i * 3 + 1] = (Math.random() - 0.5) * 1500
            p[i * 3 + 2] = (Math.random() - 0.5) * 250
        }
        return p
    }, [])

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={points}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.4} sizeAttenuation />
        </points>
    )
}
