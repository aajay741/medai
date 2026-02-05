import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraRig({ scrollProgress }) {
    const groupRef = useRef()

    useFrame((state) => {
        // Continuous descent: Now 11 stages, largest descent yet
        const targetY = -scrollProgress * 280

        // High-precision smooth interpolation
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.04)

        // Cinematic organic drift
        state.camera.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.025
        state.camera.rotation.x = -Math.PI * 0.07 + Math.sin(state.clock.elapsedTime * 0.1) * 0.025

        // Immersive mouse reactivity
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.mouse.x * 5, 0.04)

        // Deep focus look-ahead
        state.camera.lookAt(0, targetY - 25, -80)
    })

    return <group ref={groupRef} />
}
