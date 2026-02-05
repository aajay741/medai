import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import CameraRig from './CameraRig'
import StageLights from './StageLights'
import ParticleSystem from './ParticleSystem'
import MicModel from './MicModel'
import SceneBackground from './SceneBackground'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'

export default function CanvasWrapper({ scrollProgress }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 50 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
        >
            <Suspense fallback={null}>
                {/* Camera Control */}
                <CameraRig scrollProgress={scrollProgress} />

                {/* Dynamic Background */}
                <SceneBackground scrollProgress={scrollProgress} />

                {/* Lighting */}
                <StageLights scrollProgress={scrollProgress} />

                {/* 3D Elements */}
                <ParticleSystem scrollProgress={scrollProgress} />
                <MicModel scrollProgress={scrollProgress} />

                {/* Post-processing Effects */}
                <EffectComposer>
                    <Bloom
                        intensity={0.5}
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                    />
                    <Vignette
                        offset={0.3}
                        darkness={0.5}
                    />
                    <Noise
                        opacity={0.02}
                    />
                </EffectComposer>
            </Suspense>
        </Canvas>
    )
}
