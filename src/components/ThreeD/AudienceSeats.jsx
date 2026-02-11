import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

export default function AudienceSeats({ position = [0, 0, 0], rows = 5, seatsPerRow = 8 }) {
    const groupRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                child.position.y = Math.sin(time * 2 + i * 0.5) * 0.05
            })
        }
    })

    const seats = []
    for (let row = 0; row < rows; row++) {
        for (let seat = 0; seat < seatsPerRow; seat++) {
            seats.push({
                x: (seat - seatsPerRow / 2) * 1.5,
                y: 0,
                z: row * 1.8
            })
        }
    }

    return (
        <group ref={groupRef} position={position}>
            {seats.map((seat, i) => (
                <group key={i} position={[seat.x, seat.y, seat.z]}>
                    {/* Seat Base */}
                    <Sphere args={[0.3, 16, 16]} position={[0, 0.3, 0]}>
                        <meshStandardMaterial color="#4A0E0E" roughness={0.8} />
                    </Sphere>
                    {/* Seat Back */}
                    <Sphere args={[0.25, 16, 16]} position={[0, 0.8, -0.2]} scale={[1, 1.5, 0.5]}>
                        <meshStandardMaterial color="#4A0E0E" roughness={0.8} />
                    </Sphere>
                    {/* Glowing "Person" indicator */}
                    <Sphere args={[0.1, 8, 8]} position={[0, 1.2, 0]}>
                        <meshBasicMaterial color="#FFD700" opacity={0.3 + Math.random() * 0.3} transparent />
                    </Sphere>
                </group>
            ))}
        </group>
    )
}
