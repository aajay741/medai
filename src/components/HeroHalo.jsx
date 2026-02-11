import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Torus, Float } from '@react-three/drei'

export default function HeroHalo() {
    const ring1 = useRef()
    const ring2 = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (ring1.current) {
            ring1.current.rotation.x = time * 0.1
            ring1.current.rotation.y = time * 0.15
        }
        if (ring2.current) {
            ring2.current.rotation.x = -time * 0.12
            ring2.current.rotation.y = -time * 0.18
        }
    })

    return (
        <group scale={15}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Torus ref={ring1} args={[1, 0.002, 16, 100]}>
                    <meshBasicMaterial color="#A78BFA" transparent opacity={0.2} />
                </Torus>
                <Torus ref={ring2} args={[1.05, 0.002, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
                </Torus>
            </Float>
        </group>
    )
}
