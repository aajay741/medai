import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraRig({ scrollProgress }) {
    const groupRef = useRef()

    useFrame((state) => {
        // Continuous descent: Now 9 stages, so deeper total travel
        const targetY = -scrollProgress * 200

        // Smooth interpolation
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05)

        // Subtle organic tilt
        state.camera.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.015
        state.camera.rotation.x = -Math.PI * 0.05 + Math.sin(state.clock.elapsedTime * 0.2) * 0.015

        // Slight mouse influence
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 3, 0.05)

        // Look slightly ahead
        state.camera.lookAt(0, targetY - 15, -60)
    })

    return <group ref={groupRef} />
}
