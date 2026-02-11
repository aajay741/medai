import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Text } from '@react-three/drei'

export default function CityMarker({ position, name }) {
    const meshRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.scale.setScalar(1 + Math.sin(time * 3) * 0.1)
        }
    })

    return (
        <group position={position}>
            <Sphere ref={meshRef} args={[0.3, 32, 32]}>
                <MeshDistortMaterial
                    color="#A78BFA"
                    speed={5}
                    distort={0.3}
                    emissive="#A78BFA"
                    emissiveIntensity={2}
                />
            </Sphere>
            <Text
                position={[0, 1, 0]}
                fontSize={0.5}
                color="white"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf"
            >
                {name}
            </Text>
        </group>
    )
}
