import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SceneBackground({ scrollProgressRef }) {
    const bgMeshRef = useRef()
    // OPTIMIZATION: Cache color to avoid creating new Color objects every frame
    const targetColor = useRef(new THREE.Color())
    const lastScrollProgress = useRef(0)

    useFrame((state) => {
        if (!bgMeshRef.current) return

        // OPTIMIZATION: Read from ref
        const scrollProgress = scrollProgressRef.current

        // RESTORATION: Only update if scroll changed significantly
        if (Math.abs(scrollProgress - lastScrollProgress.current) > 0.001) {
            const material = bgMeshRef.current.material

            // RESTORATION: Shift from deep black to a subtle, premium indigo-tinged depth
            // This ensures the background has "spatial volume" and doesn't feel flat
            targetColor.current.setHSL(0.7, 0.2, 0.02 + scrollProgress * 0.08)
            material.uniforms.color1.value.lerp(targetColor.current, 0.08)

            // Secondary color shift for gradient depth
            const targetColor2 = new THREE.Color().setHSL(0.7, 0.3, 0.01 + scrollProgress * 0.04)
            material.uniforms.color2.value.lerp(targetColor2, 0.05)

            lastScrollProgress.current = scrollProgress
        }
    })

    // OPTIMIZATION: Shaders are already optimized (minimal operations)
    const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
    `

    const fragmentShader = `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        
        void main() {
          // 1. Base cinematic gradient
          vec3 baseColor = mix(color1, color2, vUv.y);
          
          // 2. READABILITY MASK: Subtle central darkening to help text stand out
          // Distance from center (0.5, 0.5)
          float dist = distance(vUv, vec2(0.5, 0.5));
          // Create a soft "pocket" of darkness in the center where text lives
          float mask = smoothstep(0.2, 0.8, dist);
          
          // Darken the center slightly more (content-first priority)
          vec3 finalColor = baseColor * (0.85 + mask * 0.15);
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
    `

    return (
        <mesh ref={bgMeshRef} position={[0, 0, -1]} frustumCulled={false}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    color1: { value: new THREE.Color('#030303') },
                    color2: { value: new THREE.Color('#000000') },
                }}
                depthWrite={false}
            />
        </mesh>
    )
}
