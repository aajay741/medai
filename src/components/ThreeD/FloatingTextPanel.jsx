import { Text, Float } from '@react-three/drei'

export default function FloatingTextPanel({ text, position = [0, 0, 0], fontSize = 1, color = "#ffffff" }) {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
                position={position}
                fontSize={fontSize}
                color={color}
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGkyMZhrib2Bg-4.ttf"
                anchorX="center"
                anchorY="middle"
                maxWidth={10}
                textAlign="center"
            >
                {text}
                <meshBasicMaterial transparent opacity={0.6} />
            </Text>
        </Float>
    )
}
