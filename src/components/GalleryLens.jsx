import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Icosahedron, MeshDistortMaterial, Float, MeshTransmissionMaterial } from '@react-three/drei'

function Lens() {
    const meshRef = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (meshRef.current) {
            meshRef.current.rotation.x = time * 0.2
            meshRef.current.rotation.y = time * 0.3
        }
    })

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <Icosahedron ref={meshRef} args={[2, 0]}>
                <MeshTransmissionMaterial
                    backside
                    samples={8}
                    thickness={0.2}
                    roughness={0}
                    anisotropy={1}
                    chromaticAberration={0.1}
                    distortion={0.5}
                    distortionScale={0.5}
                    temporalDistortion={0.5}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor="#ffffff"
                    color="#A78BFA"
                    transparent
                    opacity={0.8}
                />
            </Icosahedron>
        </Float>
    )
}

export default function GalleryLens() {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} />
                <pointLight position={[-10, -10, -10]} color="#A78BFA" intensity={1} />
                <Lens />
            </Canvas>
        </div>
    )
}
