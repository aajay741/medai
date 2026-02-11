import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Cylinder, Box, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function MicModel({ scrollProgressRef }) {
    const groupRef = useRef()
    const ringsRef = useRef()

    // Abstract Theater/Stage elements mapped to 11 sections
    const elements = useMemo(() => [
        // Stage 0: Hero (Centered/Stable)
        { type: 'portal', pos: [0, 0, 0], rot: [0, 0, 0], scale: 1.5, color: '#ffffff', stage: 0 },
        { type: 'microphone', pos: [5, -4, 5], rot: [0, -0.5, 0], scale: 0.8, color: '#A78BFA', stage: 0 },
        { type: 'platform', pos: [0, -10, 0], rot: [0, 0, 0], scale: 1.2, color: '#ffffff', stage: 0 },
        { type: 'camera', pos: [8, 5, -8], rot: [0, -0.5, 0], scale: 0.8, color: '#ffffff', stage: 0 },

        // Stage 1: The Vision (Left to Right)
        { type: 'camera', pos: [0, -20, -12], rot: [0, -0.8, 0], scale: 1, color: '#ffffff', stage: 1 },
        { type: 'pillar', pos: [-15, -25, -10], rot: [0, 0.5, 0], scale: 1, color: '#ffffff', stage: 1 },

        // Stage 2: Growth (Right to Left)
        { type: 'camera', pos: [0, -60, -5], rot: [0, 0.6, 0], scale: 1.2, color: '#ffffff', stage: 2 },
        { type: 'data_cluster', pos: [8, -60, 0], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 2 },

        // Stage 3: The Network (Left to Right)
        { type: 'camera', pos: [0, -100, -8], rot: [0, -0.4, 0], scale: 1, color: '#ffffff', stage: 3 },
        { type: 'platform', pos: [0, -100, 0], rot: [0, 0, 0], scale: 2, color: '#ffffff', stage: 3 },
        { type: 'spotlight', pos: [15, -85, -5], rot: [Math.PI / 4, -Math.PI / 4, 0], scale: 1.2, color: '#ffffff', stage: 3 },
        { type: 'spotlight', pos: [-15, -85, -5], rot: [Math.PI / 4, Math.PI / 4, 0], scale: 1.2, color: '#ffffff', stage: 3 },
        { type: 'lattice', pos: [-18, -100, -15], rot: [0.1, 0.4, 0.2], scale: 5, color: '#ffffff', stage: 3 },

        // Stage 4: Infrastructure (Right to Left)
        { type: 'camera', pos: [0, -145, -5], rot: [0, 0.5, 0], scale: 1, color: '#ffffff', stage: 4 },
        { type: 'heavy_rig', pos: [0, -145, -12], rot: [Math.PI / 2, 0, 0], scale: 2, color: '#ffffff', stage: 4 },

        // Stage 5: The Vibe (Left to Right)
        { type: 'camera', pos: [0, -185, 0], rot: [0, -0.6, 0], scale: 0.8, color: '#ffffff', stage: 5 },
        { type: 'waves', pos: [0, -185, -5], rot: [0, 0, 0], scale: 3, color: '#ffffff', stage: 5 },

        // Stage 6: Collaborators (Right to Left)
        { type: 'camera', pos: [0, -225, -5], rot: [0, 0.4, 0], scale: 1.2, color: '#ffffff', stage: 6 },
        { type: 'poly', pos: [12, -225, -8], rot: [Math.PI / 3, 0, 0], scale: 2, color: '#ffffff', stage: 6 },

        // Stage 7: Community (Left to Right)
        { type: 'camera', pos: [0, -270, -10], rot: [0, -0.3, 0], scale: 1, color: '#ffffff', stage: 7 },
        { type: 'sphere_float', pos: [-15, -270, -10], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 7 },

        // Stage 8: Quote (Right to Left pattern)
        { type: 'camera', pos: [0, -320, 0], rot: [0, 0.5, 0], scale: 1, color: '#ffffff', stage: 8 },
        { type: 'super_core', pos: [0, -320, -2], rot: [0, 0, 0], scale: 1.2, color: '#ffffff', stage: 8 },

        // Stage 9: Gallery (Right to Left as requested)
        { type: 'camera', pos: [0, -365, -5], rot: [0, -0.4, 0], scale: 1.2, color: '#ffffff', stage: 9 },
        { type: 'optical_assembly', pos: [-12, -365, -5], rot: [0, 0.8, 0], scale: 2.5, color: '#ffffff', stage: 9 },

        // Stage 10: Contact Hero (The Beacon)
        { type: 'camera', pos: [0, -440, 5], rot: [0, -0.2, 0], scale: 1, color: '#ffffff', stage: 10 },
        { type: 'beacon', pos: [0, -440, 0], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 10 },

        // Stage 11: Contact Form (Signal Portal)
        { type: 'portal', pos: [0, -500, -10], rot: [0.2, 0, 0], scale: 4, color: '#A78BFA', stage: 11 },
        { type: 'camera', pos: [-12, -510, 5], rot: [0, 0.5, 0], scale: 1.2, color: '#ffffff', stage: 11 },
        { type: 'camera', pos: [12, -510, -5], rot: [0, -0.5, 0], scale: 1.2, color: '#ffffff', stage: 11 }
    ], [])

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (groupRef.current) groupRef.current.rotation.y = Math.sin(time * 0.05) * 0.05
        if (ringsRef.current) ringsRef.current.rotation.z = time * 0.05
    })

    return (
        <group ref={groupRef}>
            {elements.map((el, i) => (
                <FloatStageElement key={i} element={el} scrollProgressRef={scrollProgressRef} />
            ))}

            <group ref={ringsRef} position={[0, -250, -100]}>
                {[...Array(10)].map((_, i) => (
                    <Torus key={i} args={[200 + i * 80, 0.001, 12, 120]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshBasicMaterial color="#ffffff" transparent opacity={0.005} />
                    </Torus>
                ))}
            </group>

            <PointsBuffer />
            <EnergyFibers />
            <ForegroundBokeh />
            <StageGlobalBeams scrollProgressRef={scrollProgressRef} />
        </group>
    )
}

function FloatStageElement({ element, scrollProgressRef }) {
    const meshRef = useRef()
    const sectionIndex = element.stage
    const sectionStart = sectionIndex * (1 / 12)

    const scaleVec = useRef(new THREE.Vector3())

    useFrame((state) => {
        if (!meshRef.current) return

        const scrollProgress = scrollProgressRef.current
        const time = state.clock.elapsedTime
        const dist = Math.abs(scrollProgress - sectionStart)

        const active = Math.max(0, 1 - dist * 10)
        const softActive = Math.max(0, 1 - dist * 3)

        const shouldBeVisible = dist < 0.5
        if (meshRef.current.visible !== shouldBeVisible) {
            meshRef.current.visible = shouldBeVisible
        }

        if (shouldBeVisible) {
            if (element.type === 'camera') {
                meshRef.current.rotation.y = Math.sin(time * 0.8) * 0.3 + element.rot[1]
                meshRef.current.rotation.x = Math.cos(time * 0.5) * 0.1 + element.rot[0]
            } else {
                meshRef.current.rotation.y += 0.005 + active * 0.02
            }

            const floatY = Math.sin(time + element.stage) * 0.1
            const depthFactor = (1 - softActive) * -30

            let xOffset = 0
            if (element.type === 'camera') {
                const direction = [1, 3, 5, 7].includes(sectionIndex) ? 1 : -1;
                const scrollOffset = (scrollProgress - sectionStart) * 50
                const zigZag = Math.sin(time * 1.5) * 5
                xOffset = (scrollOffset * direction) + zigZag
            }

            meshRef.current.position.set(
                element.pos[0] + xOffset,
                element.pos[1] + floatY,
                element.pos[2] + depthFactor
            )

            const s = element.scale * (0.9 + active * 0.2)
            scaleVec.current.setScalar(s)
            meshRef.current.scale.copy(scaleVec.current)

            if (meshRef.current.children[0]?.children[0]?.material) {
                const mat = meshRef.current.children[0].children[0].material
                if (mat.transparent) {
                    mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.2 + active * 0.6, 0.1)
                }
            } else if (meshRef.current.children[0]?.material) {
                const mat = meshRef.current.children[0].material
                if (mat.transparent) {
                    mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.2 + active * 0.6, 0.1)
                }
            }
        }
    })

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5} position={element.pos}>
            <group ref={meshRef} rotation={element.rot}>
                {element.type === 'portal' && <Torus args={[4.5, 0.03, 16, 100]}><meshBasicMaterial color={element.color} transparent opacity={0.6} /></Torus>}
                {element.type === 'microphone' && (
                    <group>
                        <Cylinder args={[0.08, 0.08, 12, 16]} position={[0, -6, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.5} /></Cylinder>
                        <Cylinder args={[0.05, 0.05, 4, 16]} position={[0, 0, 1]} rotation={[Math.PI / 4, 0, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.5} /></Cylinder>
                        <Sphere args={[0.3, 16, 16]} position={[0, 1.4, 2.4]}><meshStandardMaterial color={element.color} emissive={element.color} emissiveIntensity={5} transparent opacity={0.8} /></Sphere>
                    </group>
                )}
                {element.type === 'spotlight' && (
                    <group>
                        <Cylinder args={[0.8, 1.2, 3, 16]}><meshStandardMaterial color="#ffffff" transparent opacity={0.6} /></Cylinder>
                        <Cylinder args={[0.8, 12, 60, 32]} position={[0, -30, 0]}><meshBasicMaterial color="#ffffff" transparent opacity={0.08} /></Cylinder>
                    </group>
                )}
                {element.type === 'platform' && (
                    <group>
                        <Cylinder args={[15, 15, 1, 64]}><meshStandardMaterial color="#ffffff" transparent opacity={0.2} metalness={1} roughness={0} /></Cylinder>
                        <Torus args={[15.1, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]}><meshBasicMaterial color="#A78BFA" transparent opacity={0.8} /></Torus>
                    </group>
                )}
                {element.type === 'camera' && (
                    <group>
                        <Box args={[1.8, 1.2, 1.2]}><meshStandardMaterial color="#ffffff" transparent opacity={0.6} /></Box>
                        <Cylinder args={[0.4, 0.4, 1.5, 16]} position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.6} /></Cylinder>
                    </group>
                )}
                {element.type === 'pillar' && <Box args={[0.2, 400, 0.2]}><meshStandardMaterial color="#ffffff" transparent opacity={0.3} /></Box>}
                {element.type === 'data_cluster' && (
                    <group>
                        {[...Array(12)].map((_, i) => (
                            <Box key={i} args={[0.5, 0.5, 0.5]} position={[Math.sin(i * 1.5) * 10, Math.cos(i * 1.5) * 10, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.5} /></Box>
                        ))}
                    </group>
                )}
                {element.type === 'lattice' && <Box args={[5, 5, 5]}><meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.2} /></Box>}
                {element.type === 'heavy_rig' && <Torus args={[18, 0.4, 16, 8]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.5} /></Torus>}
                {element.type === 'waves' && (
                    <group>
                        {[...Array(20)].map((_, i) => (
                            <Cylinder key={i} args={[0.005, 0.005, 200, 8]} position={[i * 3 - 30, 0, 0]}><meshBasicMaterial color="#ffffff" transparent opacity={0.1} /></Cylinder>
                        ))}
                    </group>
                )}
                {element.type === 'super_core' && <Sphere args={[4, 64, 64]}><MeshDistortMaterial color="#ffffff" speed={3} distort={0.4} radius={1} transparent opacity={0.6} /></Sphere>}
                {element.type === 'optical_assembly' && <group><Torus args={[8, 0.2, 16, 100]} rotation={[0, Math.PI / 2, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.4} /></Torus></group>}
                {element.type === 'beacon' && (
                    <group>
                        <Sphere args={[2, 32, 32]}><meshBasicMaterial color="#ffffff" /></Sphere>
                        <Cylinder args={[0.1, 40, 1200, 32]} position={[0, -600, 0]} rotation={[Math.PI, 0, 0]}><meshBasicMaterial color="#ffffff" transparent opacity={0.15} /></Cylinder>
                    </group>
                )}
            </group>
        </Float>
    )
}

function ForegroundBokeh() {
    const count = 40
    const points = useMemo(() => {
        const p = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 100
            p[i * 3 + 1] = (Math.random() - 0.5) * 1000
            p[i * 3 + 2] = (Math.random()) * 20
        }
        return p
    }, [])

    const pointsRef = useRef()
    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.position.y = (state.clock.elapsedTime * 0.5) % 1000 - 500
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={2.5} color="#A78BFA" transparent opacity={0.03} sizeAttenuation />
        </points>
    )
}

function EnergyFibers() {
    const segments = 10
    const count = 5
    const fibers = useMemo(() => [...Array(count)].map(() => ({
        x: (Math.random() - 0.5) * 150,
        z: (Math.random() - 0.5) * 150,
        speed: 0.1 + Math.random() * 0.2
    })), [])

    return (
        <group>
            {fibers.map((f, i) => (
                <Cylinder key={i} args={[0.01, 0.01, 2000, 8]} position={[f.x, -1000, f.z]}>
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
                </Cylinder>
            ))}
        </group>
    )
}

function StageGlobalBeams({ scrollProgressRef }) {
    return (
        <group>
            {[...Array(12)].map((_, i) => (
                <Cylinder
                    key={i}
                    args={[1, 50, 4000, 32]}
                    position={[Math.sin(i) * 500, -2000, Math.cos(i) * 500]}
                    rotation={[Math.PI * 0.1, 0, (i - 6) * 0.05]}
                >
                    <meshBasicMaterial color="#A78BFA" transparent opacity={0.008} />
                </Cylinder>
            ))}
        </group>
    )
}

function PointsBuffer() {
    const count = 8000
    const points = useMemo(() => {
        const p = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 800
            p[i * 3 + 1] = (Math.random() - 0.5) * 4000
            p[i * 3 + 2] = (Math.random() - 0.5) * 800
        }
        return p
    }, [])

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={points} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.2} sizeAttenuation />
        </points>
    )
}
