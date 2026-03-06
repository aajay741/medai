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

export default function CanvasWrapper({ scrollProgressRef, tier = 2, isPaused = false }) {
    const isLowTier = tier === 0
    const isMidTier = tier === 1

    return (
        <Canvas
            camera={{ position: [0, 0, 10], fov: 50 }}
            // OPTIMIZATION: Optimized GL settings for performance
            gl={{
                antialias: tier > 0 && !isMobile, // Disable AA on low tier or mobile
                alpha: false, // Opaque background is faster
                powerPreference: 'high-performance',
                stencil: false, // Not needed, saves memory
                depth: true,
            }}
            // OPTIMIZATION: Adaptive DPR
            dpr={isMobile ? 1 : (isLowTier ? 1 : [1, 1.5])}
            // OPTIMIZATION: Enable performance features
            shadows={false} // Shadows disabled (not used in current scene)
            flat // Disable tone mapping for better performance
            linear // Use linear color space (faster)
            frameloop={isPaused ? "demand" : "always"}
            // OPTIMIZATION: Enable frustum culling
            onCreated={({ gl, scene }) => {
                if (!gl || !scene) return
                gl.setClearColor('#030303')
                // Enable frustum culling for all objects
                scene.traverse((obj) => {
                    if (obj && obj.isMesh) {
                        obj.frustumCulled = true
                    }
                })
            }}
        >
            <Suspense fallback={null}>
                {/* Camera Control - OPTIMIZATION: Now uses ref */}
                <CameraRig scrollProgressRef={scrollProgressRef} />

                {/* Dynamic Background */}
                <SceneBackground scrollProgressRef={scrollProgressRef} tier={tier} />

                {/* Lighting */}
                <StageLights scrollProgressRef={scrollProgressRef} tier={tier} />

                {/* Atmostphere & Depth */}
                <AmbientDust count={isMobile || isLowTier ? 100 : 300} />
                <GlowPlane position={[0, 0, -50]} scale={[100, 100, 1]} color="#A78BFA" opacity={0.02} />

                {!isLowTier && (
                    <GlowPlane position={[20, 20, -30]} scale={[50, 50, 1]} color="#ffffff" opacity={0.01} />
                )}

                {/* 3D Elements */}
                <ParticleSystem scrollProgressRef={scrollProgressRef} tier={tier} />
                <MicModel scrollProgressRef={scrollProgressRef} tier={tier} />

                {/* OPTIMIZATION: Reduced post-processing for better performance */}
                <EffectComposer
                    multisampling={0} // Disable MSAA (expensive)
                    enabled={!isMobile && tier > 1} // Disable post-processing on mobile or low/mid tiers
                    resolutionScale={isPaused ? 0.2 : (isLowTier ? 0.5 : 0.8)}
                >
                    <Bloom
                        intensity={isMobile ? 0.4 : 0.8}
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                        mipmapBlur
                        levels={isMobile ? 3 : 5}
                    />
                    <Vignette
                        offset={0.3}
                        darkness={0.6}
                        blendFunction={BlendFunction.NORMAL}
                    />
                    <Noise
                        opacity={0.03}
                        blendFunction={BlendFunction.OVERLAY}
                    />
                </EffectComposer>
            </Suspense>
        </Canvas>
    )
}
