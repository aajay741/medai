import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei'
import * as THREE from 'three'

export default function NeuralPulse3D() {
    const groupRef = useRef()
    const coreRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.2
            groupRef.current.rotation.z = time * 0.1
        }
        if (coreRef.current) {
            coreRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1)
        }
    })

    const satellites = useMemo(() => {
        return [...Array(8)].map((_, i) => ({
            dist: 6 + Math.random() * 4,
            speed: 0.5 + Math.random() * 1,
            offset: i * Math.PI * 0.25,
            size: 0.2 + Math.random() * 0.4
        }))
    }, [])

    return (
        <group ref={groupRef}>
            {/* Central Core */}
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <Sphere ref={coreRef} args={[3, 64, 64]}>
                    <MeshDistortMaterial
                        color="#A78BFA"
                        speed={3}
                        distort={0.4}
                        radius={1}
                        emissive="#A78BFA"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.8}
                    />
                </Sphere>
            </Float>

            {/* Orbiting Satellite Points */}
            {satellites.map((s, i) => (
                <Satellite key={i} data={s} />
            ))}

            {/* Connecting Lines (Simulated with thin cylinders or points) */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={1000}
                        array={new Float32Array(3000).map(() => (Math.random() - 0.5) * 50)}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.05} color="#A78BFA" transparent opacity={0.2} />
            </points>
        </group>
    )
}

function Satellite({ data }) {
    const ref = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        const angle = time * data.speed + data.offset
        ref.current.position.set(
            Math.cos(angle) * data.dist,
            Math.sin(angle * 0.5) * 2,
            Math.sin(angle) * data.dist
        )
    })

    return (
        <Sphere ref={ref} args={[data.size, 16, 16]}>
            <meshStandardMaterial color="#fff" emissive="#A78BFA" emissiveIntensity={2} />
        </Sphere>
    )
}
