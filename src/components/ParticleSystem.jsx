import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleSystem({ scrollProgress }) {
    const particlesRef = useRef()

    const particleCount = 1500
    const particles = useMemo(() => {
        const positions = new Float32Array(particleCount * 3)
        const sizes = new Float32Array(particleCount)

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3
            positions[i3] = (Math.random() - 0.5) * 40
            positions[i3 + 1] = (Math.random() - 0.5) * 40
            positions[i3 + 2] = (Math.random() - 0.5) * 40
            sizes[i] = Math.random() * 2
        }

        return { positions, sizes }
    }, [])

    useFrame((state) => {
        if (!particlesRef.current) return
        const time = state.clock.elapsedTime

        // Dynamic rotation based on scroll
        particlesRef.current.rotation.y = time * 0.05 + scrollProgress * 2
        particlesRef.current.rotation.x = time * 0.03

        // Subtle breathing effect
        const s = 1 + Math.sin(time * 0.2) * 0.1
        particlesRef.current.scale.set(s, s, s)
    })

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={particles.positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color="#ffffff"
                transparent
                opacity={0.2}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    )
}

