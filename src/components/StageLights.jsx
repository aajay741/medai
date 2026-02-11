import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function StageLights({ scrollProgressRef }) {
    const mainLight = useRef()
    const intensityCache = useRef(1.5)
    // OPTIMIZATION: Cache color targets
    const lightColor = useRef(new THREE.Color())
    const warmColor = new THREE.Color('#fff4e0') // Warmer stage tone
    const coolColor = new THREE.Color('#e0f4ff') // Cooler tech tone

    useFrame((state) => {
        const scrollProgress = scrollProgressRef.current
        const time = state.clock.elapsedTime

        if (mainLight.current) {
            // 1. THEATRICAL "SCENE DIP"
            // Dim slightly during transitions (mid-points) and peak at major sections
            const sectionFreq = 11
            const sectionProximity = Math.cos(scrollProgress * sectionFreq * Math.PI) * 0.5 + 0.5

            // Base intensity that breathes, plus theatrical focus proximity
            const baseIntensity = 1.6 + Math.sin(time * 0.5) * 0.1
            const transitionDim = 0.8 + (sectionProximity * 0.4)
            const newIntensity = baseIntensity * transitionDim

            if (Math.abs(intensityCache.current - newIntensity) > 0.005) {
                mainLight.current.intensity = newIntensity
                intensityCache.current = newIntensity
            }

            // 2. GRADUAL COLOR TEMPERATURE SHIFT
            lightColor.current.lerpColors(warmColor, coolColor, scrollProgress)
            mainLight.current.color.copy(lightColor.current)
        }
    })

    return (
        <group>
            {/* RESTORATION: Increased ambient intensity for base visibility */}
            <ambientLight intensity={0.5} />

            <directionalLight
                ref={mainLight}
                position={[10, 20, 10]}
                intensity={2.5}
                color="#ffffff"
            />

            {/* RESTORATION: Added a follower light to ensure scroll targets are illuminated */}
            <pointLight
                position={[0, -scrollProgressRef.current * 320, 15]}
                intensity={4}
                distance={100}
                color="#A78BFA"
            />
        </group>
    )
}
