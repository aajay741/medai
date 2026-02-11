import { useRef } from 'react'
import { Text, Float, RoundedBox } from '@react-three/drei'

export default function InfoCard3D({ title, content, position = [0, 0, 0] }) {
    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Background Glass Panel */}
                <RoundedBox args={[4, 3, 0.1]} radius={0.2} smoothness={4} position={[0, 0, -0.06]}>
                    <meshBasicMaterial
                        color="#080808"
                        transparent
                        opacity={0.8}
                        roughness={0.2}
                    />
                </RoundedBox>
                {/* Border */}
                <RoundedBox args={[4.05, 3.05, 0.05]} radius={0.2} smoothness={4} position={[0, 0, -0.07]}>
                    <meshBasicMaterial color="#A78BFA" transparent opacity={0.3} />
                </RoundedBox>

                {/* Content */}
                <Text
                    position={[0, 0.8, 0]}
                    fontSize={0.4}
                    color="#ffffff"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={3.5}
                >
                    {title}
                </Text>
                <Text
                    position={[0, -0.2, 0]}
                    fontSize={0.2}
                    color="#cccccc"
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf"
                    anchorX="center"
                    anchorY="top"
                    maxWidth={3.5}
                    textAlign="center"
                >
                    {content}
                </Text>
            </Float>
        </group>
    )
}
