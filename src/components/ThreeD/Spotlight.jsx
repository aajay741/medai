import { useRef } from 'react'
import { SpotLight, SpotLightShadow } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Spotlight({
    position = [0, 10, 0],
    target = [0, 0, 0],
    color = "#ffffff",
    intensity = 2,
    angle = 0.5,
    penumbra = 0.5,
    distance = 20
}) {
    const light = useRef()
    const targetObj = useRef(new THREE.Object3D())

    useFrame(() => {
        if (light.current) {
            targetObj.current.position.set(...target)
            light.current.target = targetObj.current
            light.current.target.updateMatrixWorld()
        }
    })

    return (
        <group>
            <primitive object={targetObj.current} />
            <SpotLight
                ref={light}
                position={position}
                color={color}
                intensity={intensity}
                angle={angle}
                penumbra={penumbra}
                distance={distance}
                attenuation={5}
                anglePower={5}
            />
            {/* Visual cone representation if needed, but 'LightBeam' covers that */}
        </group>
    )
}
