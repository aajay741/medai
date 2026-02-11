import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({ count = 1000, color = "#A78BFA" }) {
    const meshRef = useRef()

    // Create random positions and velocities
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 50
            const y = (Math.random() - 0.5) * 50
            const z = (Math.random() - 0.5) * 50
            const speed = 0.02 + Math.random() * 0.05
            const factor = Math.random() * 100
            temp.push({ x, y, z, speed, factor })
        }
        return temp
    }, [count])

    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((state) => {
        const time = state.clock.elapsedTime
        particles.forEach((particle, i) => {
            let { x, y, z, speed, factor } = particle

            // Flow field logic (Perlin noise simulation)
            const t = time * speed
            particle.x = x + Math.cos(t + factor) * 0.1
            particle.y = y + Math.sin(t + factor) * 0.1
            particle.z = z + Math.sin(t + factor) * 0.1

            // Boundary check and loop
            if (Math.abs(particle.x) > 25) particle.x *= -0.9
            if (Math.abs(particle.y) > 25) particle.y *= -0.9
            if (Math.abs(particle.z) > 25) particle.z *= -0.9

            dummy.position.set(particle.x, particle.y, particle.z)
            dummy.scale.setScalar(Math.sin(t * 5) * 0.5 + 0.5) // Pulsing size
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} />
        </instancedMesh>
    )
}
