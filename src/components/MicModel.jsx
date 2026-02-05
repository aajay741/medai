import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Cylinder, Box, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function MicModel({ scrollProgress }) {
    const groupRef = useRef()
    const ringsRef = useRef()

    // Abstract Theater/Stage elements mapped to 11 sections
    const elements = useMemo(() => [
        // Stage 0: Hero (Centered for clarity)
        { type: 'portal', pos: [0, 0, 0], rot: [0, 0, 0], scale: 1.5, color: '#ffffff', stage: 0 },
        { type: 'pillar', pos: [-15, -25, -10], rot: [0, 0.5, 0], scale: 1, color: '#ffffff', stage: 1 },
        { type: 'data_cluster', pos: [8, -60, 0], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 2 },
        { type: 'lattice', pos: [-18, -100, -15], rot: [0.1, 0.4, 0.2], scale: 5, color: '#ffffff', stage: 3 },
        { type: 'heavy_rig', pos: [0, -145, -12], rot: [Math.PI / 2, 0, 0], scale: 2, color: '#ffffff', stage: 4 },
        { type: 'waves', pos: [0, -185, -5], rot: [0, 0, 0], scale: 3, color: '#ffffff', stage: 5 },
        { type: 'poly', pos: [12, -225, -8], rot: [Math.PI / 3, 0, 0], scale: 2, color: '#ffffff', stage: 6 },
        { type: 'sphere_float', pos: [-15, -270, -10], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 7 },
        { type: 'super_core', pos: [0, -320, -2], rot: [0, 0, 0], scale: 1.2, color: '#ffffff', stage: 8 },
        { type: 'optical_assembly', pos: [-12, -365, -5], rot: [0, 0.8, 0], scale: 2.5, color: '#ffffff', stage: 9 },
        { type: 'beacon', pos: [0, -440, 0], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 10 }
    ], [])

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (groupRef.current) groupRef.current.rotation.y = Math.sin(time * 0.05) * 0.05
        if (ringsRef.current) ringsRef.current.rotation.z = time * 0.05
    })

    return (
        <group ref={groupRef}>
            {elements.map((el, i) => (
                <FloatStageElement key={i} element={el} scrollProgress={scrollProgress} />
            ))}

            {/* Minimal Background Rings */}
            <group ref={ringsRef} position={[0, -200, -40]}>
                {[...Array(5)].map((_, i) => (
                    <Torus key={i} args={[100 + i * 40, 0.003, 12, 120]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.003} />
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
    const sectionIndex = element.stage
    const sectionStart = sectionIndex * (1 / 11)

    useFrame((state) => {
        if (!meshRef.current) return
        const time = state.clock.elapsedTime
        const dist = Math.abs(scrollProgress - sectionStart)
        const active = Math.max(0, 1 - dist * 10)

        meshRef.current.rotation.y += 0.005 + active * 0.02
        meshRef.current.position.y += Math.sin(time + element.stage) * 0.01

        const s = element.scale * (1 + active * 0.3)
        meshRef.current.scale.set(s, s, s)

        // Smarter visibility: Allow it to be seen from further away for smoother transitions
        meshRef.current.visible = dist < 0.35
    })

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5} position={element.pos}>
            <group ref={meshRef} rotation={element.rot}>
                {element.type === 'portal' && <Torus args={[4.5, 0.015, 16, 100]}><meshBasicMaterial color={element.color} transparent opacity={0.15} /></Torus>}
                {element.type === 'pillar' && <Box args={[0.3, 80, 0.3]}><meshStandardMaterial color="#ffffff" transparent opacity={0.05} /></Box>}
                {element.type === 'data_cluster' && (
                    <group>
                        {[...Array(8)].map((_, i) => (
                            <Box key={i} args={[0.15, 0.15, 0.15]} position={[Math.sin(i) * 6, Math.cos(i) * 6, 0]}>
                                <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
                            </Box>
                        ))}
                    </group>
                )}
                {element.type === 'lattice' && <Box args={[1, 1, 1]}><meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.05} /></Box>}
                {element.type === 'heavy_rig' && <Torus args={[8, 0.08, 16, 8]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.15} /></Torus>}
                {element.type === 'waves' && (
                    <group>
                        {[...Array(15)].map((_, i) => (
                            <Cylinder key={i} args={[0.001, 0.001, 100, 8]} position={[i * 1.5 - 10, 0, 0]}>
                                <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
                            </Cylinder>
                        ))}
                    </group>
                )}
                {element.type === 'super_core' && <Sphere args={[2, 48, 48]}><MeshDistortMaterial color="#ffffff" speed={2} distort={0.2} radius={1} transparent opacity={0.15} /></Sphere>}
                {element.type === 'optical_assembly' && <group><Torus args={[3, 0.05, 16, 80]} /></group>}
                {element.type === 'beacon' && (
                    <group>
                        <Sphere args={[0.5, 32, 32]}><meshBasicMaterial color="#ffffff" /></Sphere>
                        <Cylinder args={[0, 8, 500, 32]} position={[0, -250, 0]} rotation={[Math.PI, 0, 0]}>
                            <meshBasicMaterial color="#ffffff" transparent opacity={0.01} />
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
            {[...Array(6)].map((_, i) => (
                <Cylinder
                    key={i}
                    args={[0.01, 15, 1500, 32]}
                    position={[Math.sin(i) * 150, -700, Math.cos(i) * 150]}
                    rotation={[Math.PI * 0.15, 0, (i - 3) * 0.1]}
                >
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.002} />
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
            p[i * 3] = (Math.random() - 0.5) * 500
            p[i * 3 + 1] = (Math.random() - 0.5) * 3000
            p[i * 3 + 2] = (Math.random() - 0.5) * 500
        }
        return p
    }, [])

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.015} color="#ffffff" transparent opacity={0.15} sizeAttenuation />
        </points>
    )
}
