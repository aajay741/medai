import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// RESTORATION: Increased particle count and size for high-impact cinematic presence
const PARTICLE_COUNT = 2400

export default function ParticleSystem({ scrollProgressRef }) {
    const particlesRef = useRef()
    // OPTIMIZATION: Cache rotation values
    const rotationCache = useRef({ x: 0, y: 0 })

    const particles = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3)
        const sizes = new Float32Array(PARTICLE_COUNT)
        // OPTIMIZATION: Add vertex colors for variety without extra draw calls
        const colors = new Float32Array(PARTICLE_COUNT * 3)

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3
            // RESTORATION: Expanded Y range to 1000 to cover the entire camera descent
            positions[i3] = (Math.random() - 0.5) * 100
            positions[i3 + 1] = (Math.random() - 0.5) * 1000
            positions[i3 + 2] = (Math.random() - 0.5) * 100
            sizes[i] = 1 + Math.random() * 4

            // Subtle color variation
            const brightness = 0.8 + Math.random() * 0.2
            colors[i3] = brightness
            colors[i3 + 1] = brightness
            colors[i3 + 2] = brightness
        }

        return { positions, sizes, colors }
    }, [])

    useFrame((state) => {
        if (!particlesRef.current) return

        // OPTIMIZATION: Read from ref instead of prop
        const scrollProgress = scrollProgressRef.current
        const time = state.clock.elapsedTime

        // OPTIMIZATION: Cache calculations
        const rotY = time * 0.05 + scrollProgress * 2
        const rotX = time * 0.03

        // Only update if change is significant (reduces GPU updates)
        if (Math.abs(rotationCache.current.y - rotY) > 0.001) {
            particlesRef.current.rotation.y = rotY
            rotationCache.current.y = rotY
        }

        if (Math.abs(rotationCache.current.x - rotX) > 0.001) {
            particlesRef.current.rotation.x = rotX
            rotationCache.current.x = rotX
        }

        // OPTIMIZATION: Reduced breathing effect frequency
        const s = 1 + Math.sin(time * 0.2) * 0.1
        particlesRef.current.scale.setScalar(s)
    })

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={PARTICLE_COUNT}
                    array={particles.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={PARTICLE_COUNT}
                    array={particles.colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15} // Increased from 0.06 for clear visibility
                color="#ffffff"
                transparent
                opacity={0.4} // Increased from 0.25 to avoid being "invisible"
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                vertexColors // Use vertex colors for variety
            />
        </points>
    )
}

