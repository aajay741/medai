import { useRef, useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

export default function ConnectionLines({ count = 20, radius = 20, color = "#A78BFA", opacity = 0.2 }) {
    const lines = useMemo(() => {
        const segments = []
        for (let i = 0; i < count; i++) {
            const start = new THREE.Vector3(
                (Math.random() - 0.5) * radius,
                (Math.random() - 0.5) * radius,
                (Math.random() - 0.5) * radius
            )
            const end = new THREE.Vector3(
                (Math.random() - 0.5) * radius,
                (Math.random() - 0.5) * radius,
                (Math.random() - 0.5) * radius
            )
            segments.push([start, end])
        }
        return segments
    }, [count, radius])

    return (
        <group>
            {lines.map((segment, i) => (
                <Line
                    key={i}
                    points={segment}
                    color={color}
                    lineWidth={1}
                    transparent
                    opacity={opacity}
                />
            ))}
        </group>
    )
}
