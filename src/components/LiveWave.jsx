import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function LiveWave() {
    const meshRef = useRef()

    const count = 50
    const sep = 0.5

    // Create a grid of points
    const points = useMemo(() => {
        const positions = new Float32Array(count * count * 3)
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const x = (i - count / 2) * sep
                const z = (j - count / 2) * sep
                const y = 0

                const idx = (i * count + j) * 3
                positions[idx] = x
                positions[idx + 1] = y
                positions[idx + 2] = z
            }
        }
        return positions
    }, [])

    useFrame((state) => {
        const time = state.clock.elapsedTime
        const positions = meshRef.current.geometry.attributes.position.array

        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const idx = (i * count + j) * 3
                const x = positions[idx]
                const z = positions[idx + 2]

                // Create a pulsing wave effect
                const d = Math.sqrt(x * x + z * z)
                positions[idx + 1] = Math.sin(d * 0.5 - time * 2) * 0.5 * Math.exp(-d * 0.1)
            }
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true
    })

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length / 3}
                    array={points}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.06}
                color="#A78BFA"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    )
}
