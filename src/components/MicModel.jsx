import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Cylinder, Box, Sphere, Torus, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

// High-fidelity sub-components (Ensure these are accurately defined in ThreeD folder)
import CameraModel from './ThreeD/CameraModel'
import MicrophoneStand from './ThreeD/MicrophoneStand'
import StagePlatform from './ThreeD/StagePlatform'
import SpotlightModel from './ThreeD/Spotlight'
import LightBeam from './ThreeD/LightBeam'
import SpeakerModel from './ThreeD/SpeakerModel'
import VinylRecord from './ThreeD/VinylRecord'
import MusicalNote from './ThreeD/MusicalNote'
import StageLight from './ThreeD/StageLight'
import Curtain from './ThreeD/Curtain'
import SoundWave from './ThreeD/SoundWave'
import AudienceSeats from './ThreeD/AudienceSeats'

// THEATRICAL EXPERIENCE SYSTEM v2.0
export default function MicModel({ scrollProgressRef, tier = 2 }) {
    const groupRef = useRef()
    const ringsRef = useRef()

    const elements = useMemo(() => [
        // Stage 0: Hero - Opening Scene
        { type: 'portal', pos: [0, 0, 0], rot: [0, 0, 0], scale: 1.5, color: '#ffffff', stage: 0 },
        { type: 'microphone', pos: [5, -4, 5], rot: [0, -0.5, 0], scale: 0.8, color: '#A78BFA', stage: 0 },
        { type: 'camera', pos: [8, 5, -8], rot: [0, -0.5, 0], scale: 0.8, color: '#ffffff', stage: 0 },
        { type: 'note', pos: [-6, 3, 2], rot: [0, 0, 0.2], scale: 1, color: '#A78BFA', stage: 0 },
        { type: 'stagelight', pos: [-10, 8, -5], rot: [0, 0, 0], scale: 0.5, color: '#FFD700', stage: 0 },
        { type: 'stagelight', pos: [10, 8, -5], rot: [0, 0, 0], scale: 0.5, color: '#FF69B4', stage: 0 },

        // Stage 1: Vision - Curtain Opens
        { type: 'camera', pos: [0, -20, -12], rot: [0, -0.8, 0], scale: 1, color: '#ffffff', stage: 1 },
        { type: 'speaker', pos: [12, -22, -5], rot: [0, -0.4, 0], scale: 1.2, color: '#ffffff', stage: 1 },
        { type: 'curtain', pos: [0, -20, -15], rot: [0, 0, 0], scale: 0.8, color: '#8B0000', stage: 1 },
        { type: 'pillar', pos: [-15, -25, -10], rot: [0, 0.5, 0], scale: 1, color: '#ffffff', stage: 1 },

        // Stage 2: Growth - Sound Visualization
        { type: 'camera', pos: [0, -60, -5], rot: [0, 0.6, 0], scale: 1.2, color: '#ffffff', stage: 2 },
        { type: 'vinyl', pos: [-10, -62, -3], rot: [0.4, 0, 0], scale: 1, color: '#ffffff', stage: 2 },
        { type: 'soundwave', pos: [8, -60, 0], rot: [0, 0, 0], scale: 1, color: '#A78BFA', stage: 2 },
        { type: 'data_cluster', pos: [12, -60, -5], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 2 },

        // Stage 3: Network - Full Stage Setup
        { type: 'camera', pos: [0, -100, -8], rot: [0, -0.4, 0], scale: 1, color: '#ffffff', stage: 3 },
        { type: 'spotlight', pos: [15, -85, -5], rot: [Math.PI / 4, -Math.PI / 4, 0], scale: 1.2, color: '#ffffff', stage: 3 },
        { type: 'spotlight', pos: [-15, -85, -5], rot: [Math.PI / 4, Math.PI / 4, 0], scale: 1.2, color: '#ffffff', stage: 3 },
        { type: 'stagelight', pos: [0, -85, -10], rot: [0, 0, 0], scale: 0.8, color: '#A78BFA', stage: 3 },
        { type: 'lattice', pos: [-18, -100, -15], rot: [0.1, 0.4, 0.2], scale: 5, color: '#ffffff', stage: 3 },

        // Stage 4: Infrastructure - Technical Setup
        { type: 'camera', pos: [0, -145, -5], rot: [0, 0.5, 0], scale: 1, color: '#ffffff', stage: 4 },
        { type: 'heavy_rig', pos: [0, -145, -12], rot: [Math.PI / 2, 0, 0], scale: 2, color: '#ffffff', stage: 4 },
        { type: 'stagelight', pos: [-12, -140, -8], rot: [0, 0.5, 0], scale: 0.6, color: '#FFD700', stage: 4 },
        { type: 'stagelight', pos: [12, -140, -8], rot: [0, -0.5, 0], scale: 0.6, color: '#FF69B4', stage: 4 },

        // Stage 5: The Vibe - Full Performance
        { type: 'speaker', pos: [-15, -185, -10], rot: [0, 0.5, 0], scale: 2, color: '#ffffff', stage: 5 },
        { type: 'speaker', pos: [15, -185, -10], rot: [0, -0.5, 0], scale: 2, color: '#ffffff', stage: 5 },
        { type: 'note', pos: [0, -175, 5], rot: [0, 0, 0], scale: 2, color: '#A78BFA', stage: 5 },
        { type: 'soundwave', pos: [0, -185, -5], rot: [0, 0, 0], scale: 1.5, color: '#FFD700', stage: 5 },
        { type: 'waves', pos: [0, -190, -10], rot: [0, 0, 0], scale: 3, color: '#ffffff', stage: 5 },

        // Stage 6: Collaborators - Audience View
        { type: 'camera', pos: [0, -225, -5], rot: [0, 0.4, 0], scale: 1.2, color: '#ffffff', stage: 6 },
        { type: 'audience', pos: [0, -230, 10], rot: [0, 0, 0], scale: 1, color: '#4A0E0E', stage: 6 },
        { type: 'soundwave', pos: [-8, -225, 0], rot: [0, 0, 0], scale: 0.8, color: '#A78BFA', stage: 6 },

        // Stage 7: Community - Shared Experience
        { type: 'camera', pos: [0, -270, -10], rot: [0, -0.3, 0], scale: 1, color: '#ffffff', stage: 7 },
        { type: 'audience', pos: [-10, -275, 8], rot: [0, 0.3, 0], scale: 0.8, color: '#4A0E0E', stage: 7 },
        { type: 'audience', pos: [10, -275, 8], rot: [0, -0.3, 0], scale: 0.8, color: '#4A0E0E', stage: 7 },

        // Stage 8: Quote - Spotlight Moment
        { type: 'camera', pos: [0, -320, 0], rot: [0, 0.5, 0], scale: 1, color: '#ffffff', stage: 8 },
        { type: 'super_core', pos: [0, -320, -2], rot: [0, 0, 0], scale: 1.2, color: '#ffffff', stage: 8 },
        { type: 'stagelight', pos: [0, -310, -5], rot: [0, 0, 0], scale: 1, color: '#A78BFA', stage: 8 },

        // Stage 9: Gallery - Visual Archive
        { type: 'camera', pos: [0, -365, -5], rot: [0, -0.4, 0], scale: 1.2, color: '#ffffff', stage: 9 },
        { type: 'optical_assembly', pos: [-12, -365, -5], rot: [0, 0.8, 0], scale: 2.5, color: '#ffffff', stage: 9 },
        { type: 'soundwave', pos: [12, -365, -5], rot: [0, 0, 0], scale: 0.6, color: '#FF69B4', stage: 9 },

        // Stage 10: Contact Hero - The Beacon
        { type: 'camera', pos: [0, -440, 5], rot: [0, -0.2, 0], scale: 1, color: '#ffffff', stage: 10 },
        { type: 'beacon', pos: [0, -440, 0], rot: [0, 0, 0], scale: 1, color: '#ffffff', stage: 10 },
        { type: 'stagelight', pos: [-8, -435, -3], rot: [0, 0.3, 0], scale: 0.5, color: '#FFD700', stage: 10 },
        { type: 'stagelight', pos: [8, -435, -3], rot: [0, -0.3, 0], scale: 0.5, color: '#FF69B4', stage: 10 },

        // Stage 11: Contact Form - Final Call
        { type: 'portal', pos: [0, -500, -10], rot: [0.2, 0, 0], scale: 4, color: '#A78BFA', stage: 11 },
        { type: 'camera', pos: [-12, -510, 5], rot: [0, 0.5, 0], scale: 1.2, color: '#ffffff', stage: 11 },
        { type: 'camera', pos: [12, -510, -5], rot: [0, -0.5, 0], scale: 1.2, color: '#ffffff', stage: 11 },
        { type: 'soundwave', pos: [0, -510, 0], rot: [0, 0, 0], scale: 1, color: '#A78BFA', stage: 11 }
    ], [])

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (groupRef.current) groupRef.current.rotation.y = Math.sin(time * 0.05) * 0.05
        if (ringsRef.current) ringsRef.current.rotation.z = time * 0.05
    })

    return (
        <group ref={groupRef}>
            {elements.map((el, i) => (
                <FloatStageElement key={i} element={el} scrollProgressRef={scrollProgressRef} tier={tier} />
            ))}

            {tier > 1 && (
                <group ref={ringsRef} position={[0, -250, -100]}>
                    {[...Array(tier === 2 ? 10 : 5)].map((_, i) => (
                        <Torus key={i} args={[200 + i * 80, 0.001, 8, 80]} rotation={[Math.PI / 2, 0, 0]}>
                            <meshBasicMaterial color="#ffffff" transparent opacity={0.005} />
                        </Torus>
                    ))}
                </group>
            )}

            <PointsBuffer tier={tier} />
            {tier > 0 && <EnergyFibers tier={tier} />}
            {tier > 1 && <ForegroundBokeh tier={tier} />}
            <StageGlobalBeams scrollProgressRef={scrollProgressRef} tier={tier} />
        </group>
    )
}

function FloatStageElement({ element, scrollProgressRef, tier = 2 }) {
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

        // Spotlights and stage lights are always visible
        const isLight = element.type === 'spotlight' || element.type === 'stagelight'
        const shouldBeVisible = isLight ? true : dist < 0.5
        meshRef.current.visible = shouldBeVisible

        if (shouldBeVisible) {
            // Special handling for lights - they follow scroll
            if (isLight) {
                // Lights follow the scroll position smoothly
                const scrollY = scrollProgress * 500 // Convert scroll to Y position
                meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2
                meshRef.current.rotation.x = Math.cos(time * 0.3) * 0.1

                // Smooth Y position following scroll
                const targetY = element.pos[1] + scrollY
                meshRef.current.position.y = THREE.MathUtils.lerp(
                    meshRef.current.position.y,
                    targetY,
                    0.05
                )
                meshRef.current.position.x = element.pos[0] + Math.sin(time * 0.3) * 2
                meshRef.current.position.z = element.pos[2]

                // Lights always stay at full opacity
                meshRef.current.traverse((node) => {
                    if (node.isMesh && node.material) {
                        node.material.transparent = true
                        node.material.opacity = 0.9
                    }
                })
            } else if (element.type === 'camera') {
                meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.sin(time * 0.8) * 0.3 + element.rot[1], 0.05)
                meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.cos(time * 0.5) * 0.1 + element.rot[0], 0.05)

                const floatY = Math.sin(time + element.stage) * 0.1
                const depthFactor = (1 - softActive) * -30
                const direction = [1, 3, 5, 7].includes(sectionIndex) ? 1 : -1;
                const scrollOffset = (scrollProgress - sectionStart) * 50
                const zigZag = Math.sin(time * 1.5) * 5
                const xOffset = (scrollOffset * direction) + zigZag

                meshRef.current.position.set(
                    element.pos[0] + xOffset,
                    element.pos[1] + floatY,
                    element.pos[2] + depthFactor
                )

                const s = element.scale * (0.9 + active * 0.2)
                scaleVec.current.setScalar(s)
                meshRef.current.scale.copy(scaleVec.current)

                meshRef.current.traverse((node) => {
                    if (node.isMesh && node.material) {
                        node.material.transparent = true
                        node.material.opacity = THREE.MathUtils.lerp(node.material.opacity, softActive * 0.8, 0.1)
                    }
                })
            } else {
                // Other elements
                meshRef.current.rotation.y += 0.005 + active * 0.02

                const floatY = Math.sin(time + element.stage) * 0.1
                const depthFactor = (1 - softActive) * -30

                meshRef.current.position.set(
                    element.pos[0],
                    element.pos[1] + floatY,
                    element.pos[2] + depthFactor
                )

                const s = element.scale * (0.9 + active * 0.2)
                scaleVec.current.setScalar(s)
                meshRef.current.scale.copy(scaleVec.current)

                meshRef.current.traverse((node) => {
                    if (node.isMesh && node.material) {
                        node.material.transparent = true
                        node.material.opacity = THREE.MathUtils.lerp(node.material.opacity, softActive * 0.8, 0.1)
                    }
                })
            }
        }
    })

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5} position={element.pos}>
            <group ref={meshRef} rotation={element.rot}>
                {element.type === 'portal' && <Torus args={[4.5, 0.03, 16, 100]}><meshBasicMaterial color={element.color} transparent opacity={0.6} /></Torus>}
                {element.type === 'microphone' && <MicrophoneStand />}
                {element.type === 'spotlight' && (
                    <group>
                        <SpotlightModel color={element.color} />
                        <LightBeam color={element.color} opacity={0.15} />
                    </group>
                )}
                {element.type === 'platform' && <StagePlatform radius={12} />}
                {element.type === 'camera' && <CameraModel color={element.color} />}
                {element.type === 'speaker' && <SpeakerModel />}
                {element.type === 'vinyl' && <VinylRecord />}
                {element.type === 'note' && <MusicalNote color={element.color} />}
                {element.type === 'stagelight' && <StageLight position={[0, 0, 0]} color={element.color} intensity={1.5} />}
                {element.type === 'curtain' && <Curtain position={[0, 0, 0]} open={false} />}
                {element.type === 'soundwave' && <SoundWave position={[0, 0, 0]} color={element.color} />}
                {element.type === 'audience' && <AudienceSeats position={[0, 0, 0]} rows={tier === 0 ? 3 : 4} seatsPerRow={tier === 0 ? 5 : 6} tier={tier} />}
                {element.type === 'pillar' && <Box args={[0.2, 400, 0.2]}><meshStandardMaterial color="#ffffff" transparent opacity={0.3} /></Box>}
                {element.type === 'data_cluster' && (
                    <group>
                        {[...Array(12)].map((_, i) => (
                            <Box key={i} args={[0.5, 0.5, 0.5]} position={[Math.sin(i * 1.5) * 10, Math.cos(i * 1.5) * 10, 0]}>
                                <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
                            </Box>
                        ))}
                    </group>
                )}
                {element.type === 'lattice' && <Box args={[5, 5, 5]}><meshStandardMaterial color="#ffffff" wireframe transparent opacity={0.2} /></Box>}
                {element.type === 'heavy_rig' && <Torus args={[18, 0.4, 16, 8]} rotation={[Math.PI / 2, 0, 0]}><meshStandardMaterial color="#ffffff" transparent opacity={0.5} /></Torus>}
                {element.type === 'waves' && (
                    <group>
                        {[...Array(20)].map((_, i) => (
                            <Cylinder key={i} args={[0.005, 0.005, 200, 8]} position={[i * 3 - 30, 0, 0]}>
                                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
                            </Cylinder>
                        ))}
                    </group>
                )}
                {element.type === 'super_core' && (
                    <Sphere args={[4, tier === 0 ? 32 : 64, tier === 0 ? 32 : 64]}>
                        {tier === 0 ? (
                            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} emissive="#ffffff" emissiveIntensity={0.5} />
                        ) : (
                            <MeshDistortMaterial color="#ffffff" speed={3} distort={0.4} radius={1} transparent opacity={0.6} />
                        )}
                    </Sphere>
                )}
                {element.type === 'optical_assembly' && (
                    <group>
                        <Torus args={[8, 0.2, 16, 100]} rotation={[0, Math.PI / 2, 0]}>
                            <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
                        </Torus>
                    </group>
                )}
                {element.type === 'beacon' && (
                    <group>
                        <Sphere args={[2, 32, 32]}><meshBasicMaterial color="#ffffff" /></Sphere>
                        <Cylinder args={[0.1, 40, 1200, 32]} position={[0, -600, 0]} rotation={[Math.PI, 0, 0]}>
                            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
                        </Cylinder>
                    </group>
                )}
            </group>
        </Float>
    )
}

function ForegroundBokeh({ tier = 2 }) {
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

function EnergyFibers({ tier = 2 }) {
    const count = 5
    const fibers = useMemo(() => [...Array(count)].map(() => ({
        x: (Math.random() - 0.5) * 150,
        z: (Math.random() - 0.5) * 150
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

function StageGlobalBeams({ scrollProgressRef, tier = 2 }) {
    return (
        <group>
            {[...Array(12)].map((_, i) => (
                <Cylinder
                    key={i}
                    args={[1, 50, 4000, tier === 0 ? 12 : 32]}
                    position={[Math.sin(i) * 500, -2000, Math.cos(i) * 500]}
                    rotation={[Math.PI * 0.1, 0, (i - 6) * 0.05]}
                >
                    <meshBasicMaterial color="#A78BFA" transparent opacity={0.008} />
                </Cylinder>
            ))}
        </group>
    )
}

function PointsBuffer({ tier }) {
    const count = useMemo(() => {
        if (tier === 0) return 2000
        if (tier === 1) return 5000
        return 8000
    }, [tier])
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
