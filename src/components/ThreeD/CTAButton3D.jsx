import { useRef } from 'react'
import { Text, Float, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function CTAButton3D({ text = "Action", onClick, position = [0, 0, 0] }) {
    const meshRef = useRef()

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 2) * 0.1
        }
    })

    return (
        <group position={position} onClick={onClick}>
            <Float speed={5} rotationIntensity={0.5} floatIntensity={1}>
                {/* Button Base */}
                <RoundedBox args={[3, 1, 0.2]} radius={0.5} smoothness={4} ref={meshRef}>
                    <meshStandardMaterial
                        color="#A78BFA"
                        emissive="#A78BFA"
                        emissiveIntensity={0.5}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </RoundedBox>

                {/* Text */}
                <Text
                    position={[0, 0, 0.15]}
                    fontSize={0.4}
                    color="#ffffff"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf"
                    anchorX="center"
                    anchorY="middle"
                >
                    {text}
                </Text>
            </Float>
        </group>
    )
}
