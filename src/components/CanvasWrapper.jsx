import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import CameraRig from './CameraRig'
import StageLights from './StageLights'
import ParticleSystem from './ParticleSystem'
import MicModel from './MicModel'
import SceneBackground from './SceneBackground'
import AmbientDust from './ThreeD/AmbientDust'
import GlowPlane from './ThreeD/GlowPlane'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// OPTIMIZATION: Check if we're on mobile for performance adjustments
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

export default function CanvasWrapper({ scrollProgressRef }) {
    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 50 }}
            // OPTIMIZATION: Optimized GL settings for performance
            gl={{
                antialias: !isMobile, // Disable AA on mobile
                alpha: false, // Opaque background is faster
                powerPreference: 'high-performance',
                stencil: false, // Not needed, saves memory
                depth: true,
            }}
            // OPTIMIZATION: Clamp DPR to 1.5 max (was 2) to reduce pixel count
            dpr={isMobile ? 1 : [1, 1.5]}
            // OPTIMIZATION: Enable performance features
            shadows={false} // Shadows disabled (not used in current scene)
            flat // Disable tone mapping for better performance
            linear // Use linear color space (faster)
            frameloop="always"
            // OPTIMIZATION: Enable frustum culling
            onCreated={({ gl, scene }) => {
                gl.setClearColor('#030303')
                // Enable frustum culling for all objects
                scene.traverse((obj) => {
                    if (obj.isMesh) {
                        obj.frustumCulled = true
                    }
                })
            }}
        >
            <Suspense fallback={null}>
                {/* Camera Control - OPTIMIZATION: Now uses ref */}
                <CameraRig scrollProgressRef={scrollProgressRef} />

                {/* Dynamic Background */}
                <SceneBackground scrollProgressRef={scrollProgressRef} />

                {/* Lighting */}
                <StageLights scrollProgressRef={scrollProgressRef} />

                {/* Atmostphere & Depth */}
                <AmbientDust count={isMobile ? 100 : 300} />
                <GlowPlane position={[0, 0, -50]} scale={[100, 100, 1]} color="#A78BFA" opacity={0.02} />
                <GlowPlane position={[20, 20, -30]} scale={[50, 50, 1]} color="#ffffff" opacity={0.01} />

                {/* 3D Elements */}
                <ParticleSystem scrollProgressRef={scrollProgressRef} />
                <MicModel scrollProgressRef={scrollProgressRef} />

                {/* OPTIMIZATION: Reduced post-processing for better performance */}
                <EffectComposer
                    multisampling={0} // Disable MSAA (expensive)
                    enabled={!isMobile} // Disable entirely on mobile
                    // OPTIMIZATION: Reduce resolution to 80% for better performance
                    resolutionScale={isMobile ? 0.5 : 0.8}
                >
                    <Bloom
                        intensity={isMobile ? 0.4 : 0.8} // Increased from 0.5 for cinematic glow
                        luminanceThreshold={0.2} // Restored sensitivity
                        luminanceSmoothing={0.9}
                        mipmapBlur
                        levels={isMobile ? 3 : 5}
                    />
                    <Vignette
                        offset={0.3}
                        darkness={0.6} // Increased for depth
                        blendFunction={BlendFunction.NORMAL}
                    />
                    <Noise
                        opacity={0.03} // Increased from 0.01 for texture
                        blendFunction={BlendFunction.OVERLAY}
                    />
                </EffectComposer>
            </Suspense>
        </Canvas>
    )
}
