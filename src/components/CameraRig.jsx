import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraRig({ scrollProgressRef }) {
    const groupRef = useRef()
    // OPTIMIZATION: Cache targets
    const targetPos = useRef({ x: 0, y: 0 })
    const lookAtTarget = useRef(new THREE.Vector3())
    const lastScrollProgress = useRef(0)

    useFrame((state) => {
        const scrollProgress = scrollProgressRef.current
        const time = state.clock.elapsedTime

        // 1. DYNAMIC FOV BREATHING
        const velocity = Math.abs(scrollProgress - lastScrollProgress.current)
        lastScrollProgress.current = scrollProgress
        const targetFov = 50 + velocity * 150
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, 0.08)
        state.camera.updateProjectionMatrix()

        // 2. MASTER CINEMATIC ORBIT (Non-Negotiable Continuous Motion)
        // Combining Scroll Progress with constant Time-based rotation for "never-static" feel
        const totalRotations = 4.5
        const idleSpeed = 0.15
        const angle = (scrollProgress * Math.PI * totalRotations) + (time * idleSpeed)

        // Multi-layered Radius for spatial depth (60-75 units)
        const radius = 60 + Math.sin(scrollProgress * Math.PI) * 15

        // Precise Vertical Descent mapped to Section Depth
        const targetY = -scrollProgress * 540

        // Calculate Orbital Polar Coordinates
        const targetX = Math.sin(angle) * radius
        const targetZ = Math.cos(angle) * radius

        // 3. SMOOTH CAMERA TRANSITION (Gliding Interpolation)
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX + (state.mouse.x * 12), 0.05)
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.08)
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05)

        // 4. PERSISTENT SPATIAL TRACKING
        // The camera always "eyes" the center of the Stage Pillar
        const lookAtY = targetY - 20 // Slight look-ahead for momentum
        lookAtTarget.current.set(0, lookAtY, 0)

        // Handheld micro-drift and mouse reactivity
        const drift = Math.sin(time * 0.5) * 0.5
        lookAtTarget.current.x += state.mouse.x * 5 + drift
        lookAtTarget.current.y += state.mouse.y * 5

        state.camera.lookAt(lookAtTarget.current)

        // Subtle Dutch Angle for high-end cinematic tension
        state.camera.rotation.z = Math.sin(time * 0.3) * 0.02
    })

    return <group ref={groupRef} />
}
