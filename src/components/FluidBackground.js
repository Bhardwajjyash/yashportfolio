"use client"

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function Particles({ count = 500 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 28
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [count])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.012
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.008) * 0.1
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00f0ff" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function HeroObject() {
  const groupRef = useRef()
  const mouse = useRef({ x: 0, y: 0 })
  const scrollY = useRef(0)

  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const handleScroll = () => { scrollY.current = window.scrollY }
    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.current.x * Math.PI * 0.3 + t * 0.15, 0.02)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.current.y * Math.PI * 0.15 + t * 0.08, 0.02)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -scrollY.current * 0.003, 0.05)
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef}>
        <mesh scale={1.8}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.4} wireframe transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[Math.PI / 4, 0, 0]} scale={2.2}>
          <torusGeometry args={[1, 0.003, 16, 100]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.6} transparent opacity={0.4} />
        </mesh>
        <mesh rotation={[0, Math.PI / 3, Math.PI / 6]} scale={2.6}>
          <torusGeometry args={[1, 0.003, 16, 100]} />
          <meshStandardMaterial color="#3366ff" emissive="#3366ff" emissiveIntensity={0.5} transparent opacity={0.3} />
        </mesh>
        <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]} scale={3.0}>
          <torusGeometry args={[1, 0.002, 16, 100]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={0.3} transparent opacity={0.2} />
        </mesh>
        <mesh scale={0.25}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={2.5} transparent opacity={0.35} />
        </mesh>
      </group>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#050816']} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00f0ff" />
      <pointLight position={[-5, 5, -10]} intensity={0.3} color="#3366ff" />
      <pointLight position={[0, -5, 5]} intensity={0.15} color="#ff9f43" />
      <HeroObject />
      <Particles />
      <gridHelper args={[60, 60, '#0d3857', '#081a2e']} position={[0, -3, 0]} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.9} intensity={1.5} />
      </EffectComposer>
    </>
  )
}

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        <Scene />
      </Canvas>
    </div>
  )
}