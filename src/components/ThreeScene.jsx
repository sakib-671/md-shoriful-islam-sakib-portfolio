import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, TorusKnot } from '@react-three/drei'

function Crystal() {
  const ref = useRef()
  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.18
    ref.current.rotation.y += delta * 0.25
    const pointer = state.pointer
    ref.current.position.x += (pointer.x * 0.35 - ref.current.position.x) * 0.025
    ref.current.position.y += (pointer.y * 0.22 - ref.current.position.y) * 0.025
  })

  return (
    <group ref={ref}>
      <Float speed={1.8} rotationIntensity={1.1} floatIntensity={1.2}>
        <TorusKnot args={[1.05, 0.32, 180, 24]} scale={1.15}>
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.55}
            chromaticAberration={0.08}
            anisotropy={0.2}
            distortion={0.35}
            distortionScale={0.25}
            temporalDistortion={0.12}
            roughness={0.08}
            color="#8d79ff"
          />
        </TorusKnot>
      </Float>
    </group>
  )
}

export default function ThreeScene() {
  return (
    <div className="three-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5.4], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 4]} intensity={4} color="#72efff" />
        <pointLight position={[-3, -2, 2]} intensity={15} color="#ff4ecd" />
        <Suspense fallback={null}>
          <Crystal />
        </Suspense>
      </Canvas>
    </div>
  )
}
