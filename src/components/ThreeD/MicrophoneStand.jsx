import { Cylinder, Sphere } from '@react-three/drei'

export default function MicrophoneStand({ position = [0, 0, 0] }) {
    return (
        <group position={position}>
            {/* Base */}
            <Cylinder args={[0.5, 0.6, 0.1, 32]} position={[0, 0.05, 0]}>
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
            </Cylinder>

            {/* Pole */}
            <Cylinder args={[0.03, 0.03, 5, 16]} position={[0, 2.5, 0]}>
                <meshStandardMaterial color="#444" metalness={0.9} roughness={0.1} />
            </Cylinder>

            {/* Head Joint */}
            <Sphere args={[0.1, 16, 16]} position={[0, 5, 0]}>
                <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
            </Sphere>
        </group>
    )
}
