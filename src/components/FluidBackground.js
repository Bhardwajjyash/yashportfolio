"use client"

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

const ASSETS = {
  earthDay: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_atmos_2048.jpg',
  earthNight: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_lights_2048.png',
  earthClouds: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/earth_clouds_1024.png',
  moon: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/planets/moon_1024.jpg',
}

const EARTH_RADIUS = 3.2
const HISAR_LAT = 29.1492
const HISAR_LON = 75.7217
const EARTH_ROTATION_SPEED = 0.05
const ISS_ORBIT_SPEED = 0.6
const MOON_ORBIT_SPEED = 0.15
const ISS_ALTITUDE = 4.8
const MOON_ALTITUDE = 6.5
const SUN_DIRECTION = new THREE.Vector3(5, 2, 5).normalize()

function getCartesian(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

const hisarVector = getCartesian(HISAR_LAT, HISAR_LON, EARTH_RADIUS)

const HISAR_BOUNDARY_POINTS = [
  [29.35, 75.60], [29.40, 75.75], [29.38, 75.90], [29.25, 76.05],
  [29.10, 76.10], [28.95, 75.95], [28.90, 75.80], [28.95, 75.65],
  [29.05, 75.50], [29.20, 75.50], [29.35, 75.60],
]

function makePlaceholder(color) {
  const c = document.createElement('canvas')
  c.width = 1; c.height = 1
  const ctx = c.getContext('2d')
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 1, 1)
  return new THREE.CanvasTexture(c)
}

function useAsyncTextures() {
  const [textures, setTextures] = useState(null)
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    Promise.all([
      new Promise((res, rej) => loader.load(ASSETS.earthDay, res, undefined, rej)),
      new Promise((res, rej) => loader.load(ASSETS.earthNight, res, undefined, rej)),
      new Promise((res, rej) => loader.load(ASSETS.earthClouds, res, undefined, rej)),
      new Promise((res, rej) => loader.load(ASSETS.moon, res, undefined, rej)),
    ]).then(([day, night, clouds, moon]) => {
      setTextures({ day, night, clouds, moon })
    }).catch(err => console.error('Texture Load Failed:', err))
  }, [])
  return textures
}

// Responsive camera controller
function ResponsiveCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    if (size.width < 640) {
      camera.position.set(0, 0, 18)
      camera.fov = 50
    } else if (size.width < 1024) {
      camera.position.set(0, 0, 16)
      camera.fov = 47
    } else {
      camera.position.set(0, 0, 14)
      camera.fov = 45
    }
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

function TwinklingStars({ count = 5000 }) {
  const pointsRef = useRef()
  const geoRef = useRef()

  const data = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rnd = new Float32Array(count)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const r = 50 + Math.random() * 100
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
      rnd[i] = Math.random() * Math.PI * 2
      sz[i] = Math.random() * 2.0 + 0.5
    }
    return { pos, rnd, sz }
  }, [count])

  useEffect(() => {
    if (!geoRef.current) return
    geoRef.current.setAttribute('position', new THREE.BufferAttribute(data.pos, 3))
    geoRef.current.setAttribute('aPhase', new THREE.BufferAttribute(data.rnd, 1))
    geoRef.current.setAttribute('aSize', new THREE.BufferAttribute(data.sz, 1))
  }, [data])

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = clock.elapsedTime
      pointsRef.current.rotation.y = clock.elapsedTime * 0.005
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime;
          attribute float aPhase;
          attribute float aSize;
          varying float vAlpha;
          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = aSize * (150.0 / -mvPosition.z);
            vAlpha = (sin(uTime * 1.5 + aPhase) * 0.5 + 0.5) * 0.8 + 0.2;
          }
        `}
        fragmentShader={`
          varying float vAlpha;
          void main() {
            vec2 coord = gl_PointCoord - vec2(0.5);
            if (length(coord) > 0.5) discard;
            float glow = pow(1.0 - (length(coord) * 2.0), 1.5);
            gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * glow);
          }
        `}
      />
    </points>
  )
}

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const earthFragmentShader = `
  uniform sampler2D tDay;
  uniform sampler2D tNight;
  uniform sampler2D tClouds;
  uniform vec3 uSunDirection;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    float sunLight = dot(vNormal, uSunDirection);
    float dayMix = smoothstep(-0.2, 0.2, sunLight);
    vec4 dayColor = texture2D(tDay, vUv);
    vec4 nightColor = texture2D(tNight, vUv);
    vec4 cloudColor = texture2D(tClouds, vUv);
    // Brighter night lights (city lights pop)
    vec3 glowingNight = nightColor.rgb * vec3(2.5, 3.0, 3.5);
    vec3 finalEarth = mix(glowingNight, dayColor.rgb, dayMix);
    vec3 cloudLit = mix(vec3(0.0), vec3(1.0), dayMix) * cloudColor.r;
    finalEarth = mix(finalEarth, cloudLit, cloudColor.r * 0.8);
    // Less dimming so night side is visible
    finalEarth *= 0.45;
    gl_FragColor = vec4(finalEarth, 1.0);
  }
`
const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const atmosphereFragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
    gl_FragColor = vec4(0.2, 0.6, 1.0, 1.0) * intensity * 1.2;
  }
`

function OrbitalPath({ radius }) {
  const geometry = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 128; i++) {
      const t = (i / 128) * Math.PI * 2
      arr.push(new THREE.Vector3(Math.cos(t) * radius, 0, Math.sin(t) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(arr)
  }, [radius])

  return (
    <line>
      <primitive attach="geometry" object={geometry} />
      <lineBasicMaterial color="#ffffff" transparent opacity={0.12} />
    </line>
  )
}

function Moon({ orbitRadius, texture }) {
  const groupRef = useRef()
  const [hovered, setHover] = useState(false)
  const angle = useRef(Math.PI)

  useFrame((_, delta) => {
    if (!hovered) angle.current += MOON_ORBIT_SPEED * delta
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(angle.current) * orbitRadius
      groupRef.current.position.z = Math.sin(angle.current) * orbitRadius
      groupRef.current.rotation.y = -angle.current
    }
  })

  return (
    <group rotation={[Math.PI / 8, 0, Math.PI / 12]}>
      <OrbitalPath radius={orbitRadius} />
      <group ref={groupRef}>
        <mesh visible={false} onPointerOver={(e) => { e.stopPropagation(); setHover(true) }} onPointerOut={() => setHover(false)}>
          <sphereGeometry args={[1.0, 8, 8]} />
          <meshBasicMaterial />
        </mesh>
        {/* Hover scale: 0.5 -> 0.65 (subtle, not huge) */}
        <mesh scale={hovered ? 0.65 : 0.5}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial map={texture} color={texture ? '#ffffff' : '#aaaaaa'} emissive={hovered ? '#ffffff' : '#000000'} emissiveIntensity={hovered ? 0.3 : 0} roughness={1.0} />
        </mesh>
        {hovered && (
          <Html position={[0, 1.0, 0]} center zIndexRange={[100, 0]}>
            <div className="font-mono text-[10px] text-white bg-black/80 px-3 py-1.5 border border-white/30 uppercase tracking-widest backdrop-blur-md rounded-sm whitespace-nowrap pointer-events-none" style={{ boxShadow: '0 0 15px rgba(255,255,255,0.4)' }}>Moon</div>
          </Html>
        )}
      </group>
    </group>
  )
}

function ISS({ orbitRadius }) {
  const groupRef = useRef()
  const [hovered, setHover] = useState(false)
  const angle = useRef(0)

  const issOrbitGeo = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 128; i++) {
      const t = (i / 128) * Math.PI * 2
      arr.push(new THREE.Vector3(Math.cos(t) * orbitRadius, Math.sin(t) * (orbitRadius * 0.25), Math.sin(t) * orbitRadius))
    }
    return new THREE.BufferGeometry().setFromPoints(arr)
  }, [orbitRadius])

  useFrame((_, delta) => {
    if (!hovered) angle.current += ISS_ORBIT_SPEED * delta
    const t = angle.current
    if (groupRef.current) {
      groupRef.current.position.set(Math.cos(t) * orbitRadius, Math.sin(t) * (orbitRadius * 0.25), Math.sin(t) * orbitRadius)
      groupRef.current.lookAt(Math.cos(t + 0.1) * orbitRadius, Math.sin(t + 0.1) * (orbitRadius * 0.25), Math.sin(t + 0.1) * orbitRadius)
    }
  })

  return (
    <group rotation={[Math.PI / 5, 0, -Math.PI / 8]}>
      <line>
        <primitive attach="geometry" object={issOrbitGeo} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </line>
      <group ref={groupRef}>
        <mesh visible={false} onPointerOver={(e) => { e.stopPropagation(); setHover(true) }} onPointerOut={() => setHover(false)}>
          <sphereGeometry args={[1.0, 8, 8]} />
          <meshBasicMaterial />
        </mesh>
        <group scale={hovered ? 0.28 : 0.18}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
            <meshStandardMaterial color="#ffffff" metalness={0.8} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 3.0, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.3]}>
            <boxGeometry args={[2.8, 0.02, 0.6]} />
            <meshStandardMaterial color="#0055ff" emissive={hovered ? '#00f0ff' : '#002266'} emissiveIntensity={hovered ? 1.5 : 0.4} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, -0.3]}>
            <boxGeometry args={[2.8, 0.02, 0.6]} />
            <meshStandardMaterial color="#0055ff" emissive={hovered ? '#00f0ff' : '#002266'} emissiveIntensity={hovered ? 1.5 : 0.4} metalness={0.9} />
          </mesh>
        </group>
        {hovered && (
          <Html position={[0, 0.5, 0]} center zIndexRange={[100, 0]}>
            <div className="font-mono text-[10px] text-cyan bg-black/80 px-3 py-1.5 border border-cyan/50 uppercase tracking-widest backdrop-blur-md whitespace-nowrap rounded-sm pointer-events-none" style={{ boxShadow: '0 0 15px rgba(0,240,255,0.4)' }}>
              ISS (Zarya)
              <div className="text-[8px] text-white/50 mt-1">Velocity: 7.66 km/s</div>
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}

function RealisticEarth({ textures, placeholders }) {
  const earthGroupRef = useRef()
  const earthMatRef = useRef()
  const scrollRef = useRef(0)
  const smoothedScroll = useRef(0)

  const boundaryGeo = useMemo(() => {
    const pts = HISAR_BOUNDARY_POINTS.map(c => getCartesian(c[0], c[1], EARTH_RADIUS + 0.02))
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])

  const targetQ = useMemo(() => {
    const dir = hisarVector.clone().normalize()
    return new THREE.Quaternion().setFromUnitVectors(dir, new THREE.Vector3(0, 0, 1))
  }, [])

  useEffect(() => {
    const fn = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useFrame(({ clock }) => {
    if (!earthGroupRef.current) return
    smoothedScroll.current = THREE.MathUtils.lerp(smoothedScroll.current, scrollRef.current, 0.03)
    const p = smoothedScroll.current
    const idleQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), clock.elapsedTime * EARTH_ROTATION_SPEED)
    earthGroupRef.current.quaternion.slerpQuaternions(idleQ, targetQ, p)
    // Zoom into India as you scroll
    earthGroupRef.current.position.z = THREE.MathUtils.lerp(0, 6.0, p)
  })

  const uniforms = useMemo(() => ({
    tDay: { value: placeholders.day },
    tNight: { value: placeholders.night },
    tClouds: { value: placeholders.clouds },
    uSunDirection: { value: SUN_DIRECTION },
  }), [placeholders])

  useEffect(() => {
    if (earthMatRef.current && textures) {
      earthMatRef.current.uniforms.tDay.value = textures.day
      earthMatRef.current.uniforms.tNight.value = textures.night
      earthMatRef.current.uniforms.tClouds.value = textures.clouds
    }
  }, [textures])

  // Hisar visibility based on scroll
  const hisarVisible = smoothedScroll.current > 0.5
  const hisarOpacity = THREE.MathUtils.clamp((smoothedScroll.current - 0.5) * 4, 0, 1)

  return (
    <group ref={earthGroupRef}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <shaderMaterial ref={earthMatRef} vertexShader={earthVertexShader} fragmentShader={earthFragmentShader} uniforms={uniforms} />
      </mesh>
      <mesh scale={1.03}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <shaderMaterial vertexShader={atmosphereVertexShader} fragmentShader={atmosphereFragmentShader} blending={THREE.AdditiveBlending} transparent side={THREE.BackSide} depthWrite={false} />
      </mesh>
      {hisarVisible && (
        <>
          <lineLoop>
            <primitive attach="geometry" object={boundaryGeo} />
            <lineBasicMaterial color="#22d3ee" transparent opacity={hisarOpacity * 0.8} />
          </lineLoop>
          <Html position={[hisarVector.x, hisarVector.y, hisarVector.z]} center zIndexRange={[100, 0]} style={{ opacity: hisarOpacity, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-12 h-12 md:w-16 md:h-16 bg-cyan/30 rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
                <div className="absolute w-6 h-6 md:w-8 md:h-8 bg-cyan/50 rounded-full animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
                <div className="w-3 h-3 bg-white rounded-full border-2 border-cyan" style={{ boxShadow: '0 0 12px rgba(0,240,255,0.8), 0 0 30px rgba(0,240,255,0.4)' }} />
              </div>
              <div className="mt-2 font-mono font-bold text-[10px] md:text-xs text-white whitespace-nowrap bg-black/80 px-3 py-1 md:px-4 md:py-1.5 rounded-full backdrop-blur-md border border-cyan/30" style={{ boxShadow: '0 0 20px rgba(0,240,255,0.3)' }}>Hisar, Haryana</div>
            </div>
          </Html>
        </>
      )}
    </group>
  )
}

function InteractiveScene({ textures, placeholders }) {
  const sceneRef = useRef()
  const { mouse } = useThree()

  useFrame(() => {
    if (!sceneRef.current) return
    sceneRef.current.rotation.y = THREE.MathUtils.lerp(sceneRef.current.rotation.y, mouse.x * 0.08, 0.04)
    sceneRef.current.rotation.x = THREE.MathUtils.lerp(sceneRef.current.rotation.x, -mouse.y * 0.06, 0.04)
  })

  return (
    <group ref={sceneRef}>
      <color attach="background" args={['#010103']} />
      <directionalLight position={[5, 2, 5]} intensity={2.0} color="#ffffff" />
      <ambientLight intensity={0.05} />
      <TwinklingStars count={5000} />
      <RealisticEarth textures={textures} placeholders={placeholders} />
      <Moon orbitRadius={MOON_ALTITUDE} texture={textures?.moon || null} />
      <ISS orbitRadius={ISS_ALTITUDE} />
    </group>
  )
}

export default function FluidBackground() {
  const textures = useAsyncTextures()
  const placeholders = useMemo(() => ({
    day: makePlaceholder('#001122'),
    night: makePlaceholder('#000000'),
    clouds: makePlaceholder('#000000'),
  }), [])

  return (
    <div className="fixed inset-0 z-0 bg-[#010103]" style={{ pointerEvents: 'auto' }}>
      {!textures && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="font-mono text-cyan text-xs tracking-widest uppercase animate-pulse">Initializing Telemetry...</div>
        </div>
      )}
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
        <ResponsiveCamera />
        <InteractiveScene textures={textures} placeholders={placeholders} />
        <EffectComposer disableNormalPass multisampling={0}>
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={1.2} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}