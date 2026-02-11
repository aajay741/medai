import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Line, Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Node({ position, color = "#A78BFA", size = 0.5 }) {
    const meshRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.position.y += Math.sin(time + position[0]) * 0.002
        }
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Sphere ref={meshRef} position={position} args={[size, 32, 32]}>
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

function Connections({ count = 10 }) {
    const points = useMemo(() => {
        const p = []
        for (let i = 0; i < count; i++) {
            p.push(new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            ))
        }
        return p
    }, [count])

    const linePoints = useMemo(() => {
        const lines = []
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                if (points[i].distanceTo(points[j]) < 5) {
                    lines.push([points[i], points[j]])
                }
            }
        }
        return lines
    }, [points])

    return (
        <group>
            {points.map((p, i) => (
                <Node key={i} position={[p.x, p.y, p.z]} size={Math.random() * 0.3 + 0.1} />
            ))}
            {linePoints.map((line, i) => (
                <Line
                    key={i}
                    points={line}
                    color="#A78BFA"
                    lineWidth={0.5}
                    transparent
                    opacity={0.2}
                />
            ))}
        </group>
    )
}

export default function NetworkEcosystem() {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="#A78BFA" intensity={0.5} />
                <Connections count={15} />
            </Canvas>
        </div>
    )
}
