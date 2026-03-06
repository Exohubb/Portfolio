'use client'
import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Points, PointMaterial } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useReducedMotion } from '@/lib/hooks/useReducedMotion'

// ── Particle Field ───────────────────────────────────────────
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { size } = useThree()
  const isMobile = size.width < 768
  const count = isMobile ? 400 : 800

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [count])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.025
    pointsRef.current.rotation.x += delta * 0.008
    pointsRef.current.position.x +=
      (mouseRef.current.x * 0.25 - pointsRef.current.position.x) * 0.04
    pointsRef.current.position.y +=
      (-mouseRef.current.y * 0.25 - pointsRef.current.position.y) * 0.04
  })

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#00D4FF"
        size={0.04}
        sizeAttenuation
        depthWrite={false}
        opacity={0.65}
      />
    </Points>
  )
}

// ── Floating Wireframe Shapes ────────────────────────────────
function FloatingShapes() {
  const meshRefs = [
    useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!),
  ]

  useFrame((_, delta) => {
    const speeds = [0.4, 0.25, 0.35]
    meshRefs.forEach((ref, i) => {
      if (!ref.current) return
      ref.current.rotation.x += delta * speeds[i]
      ref.current.rotation.y += delta * speeds[i] * 0.7
    })
  })

  const wireMat = (
    <meshBasicMaterial
      color="#00D4FF"
      wireframe
      transparent
      opacity={0.25}
    />
  )
  const wireMat2 = (
    <meshBasicMaterial
      color="#7B5EA7"
      wireframe
      transparent
      opacity={0.2}
    />
  )

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh ref={meshRefs[0]} position={[2.5, 1, -1]}>
          <icosahedronGeometry args={[0.9, 0]} />
          {wireMat}
        </mesh>
      </Float>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1}>
        <mesh ref={meshRefs[1]} position={[-2.5, -1, -2]}>
          <torusGeometry args={[0.7, 0.25, 8, 20]} />
          {wireMat2}
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
        <mesh ref={meshRefs[2]} position={[0.5, 2.5, -3]}>
          <octahedronGeometry args={[0.75, 0]} />
          {wireMat}
        </mesh>
      </Float>
    </>
  )
}

// ── Scene ─────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#00D4FF" />
      <pointLight position={[-5, -5, 3]} intensity={0.6} color="#7B5EA7" />
      <ParticleField />
      <FloatingShapes />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={0.7}
        />
      </EffectComposer>
    </>
  )
}

// ── Static Fallback ───────────────────────────────────────────
function StaticFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-accent/20"
          style={{
            width: `${(i + 1) * 120}px`,
            height: `${(i + 1) * 120}px`,
            animationDelay: `${i * 0.5}s`,
            opacity: 0.3 - i * 0.04,
          }}
        />
      ))}
      <div className="w-24 h-24 rounded-2xl border border-accent/40 flex items-center justify-center animate-float bg-accent/5">
        <div className="w-12 h-12 rounded-xl border border-accent/60 animate-spin-slow" />
      </div>
    </div>
  )
}

// ── Export ────────────────────────────────────────────────────
export default function HeroScene() {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) return <StaticFallback />

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
