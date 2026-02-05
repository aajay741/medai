import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function SceneBackground({ scrollProgress }) {
    const bgMeshRef = useRef()

    useFrame((state) => {
        if (!bgMeshRef.current) return
        const material = bgMeshRef.current.material

        // Neutral deep gray-black shift
        const targetColor = new THREE.Color().setHSL(0, 0, 0.01 + scrollProgress * 0.03)
        material.uniforms.color1.value.lerp(targetColor, 0.05)
    })

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
          vec3 color = mix(color1, color2, vUv.y);
          gl_FragColor = vec4(color, 1.0);
        }
    `

    return (
        <mesh ref={bgMeshRef} position={[0, 0, -1]}>
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
