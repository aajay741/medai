import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function StageLights({ scrollProgress }) {
    const mainLight = useRef()

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (mainLight.current) {
            mainLight.current.intensity = 1.5 + Math.sin(time) * 0.1
        }
    })

    return (
        <>
            <ambientLight intensity={0.05} />

            <directionalLight
                ref={mainLight}
                position={[5, 10, 5]}
                intensity={1.5}
                color="#ffffff"
            />

            {/* Subtle white points instead of blue */}
            <pointLight
                position={[-10, 5, -10]}
                intensity={0.5}
                color="#ffffff"
            />

            <spotLight
                position={[0, 20, 0]}
                angle={0.2}
                penumbra={1}
                intensity={2}
                color="#ffffff"
            />
        </>
    )
}
