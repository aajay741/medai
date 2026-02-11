import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Plane, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const TransitionMaterial = shaderMaterial(
    { uTime: 0, uColor: new THREE.Color(0.0, 0.0, 0.0), uProgress: 0 },
    // Vertex Shader
    `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    // Fragment Shader
    `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uProgress;
        varying vec2 vUv;
        
        void main() {
            float dist = distance(vUv, vec2(0.5));
            float alpha = smoothstep(uProgress - 0.1, uProgress + 0.1, dist);
            gl_FragColor = vec4(uColor, 1.0 - alpha);
        }
    `
)

export default function SectionTransitionPlane({ progress = 0 }) {
    const materialRef = useRef()

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uTime += delta
            materialRef.current.uProgress = progress
        }
    })

    return (
        <Plane args={[20, 20]} position={[0, 0, 5]}>
            {/* <transitionMaterial ref={materialRef} transparent depthTest={false} /> */}
            {/* Using standard material for basic implementation first */}
            <meshBasicMaterial
                color="#000000"
                transparent
                opacity={Math.max(0, 1 - progress)}
                depthTest={false}
            />
        </Plane>
    )
}
