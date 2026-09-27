"use client"

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

const ASSETS = {
  earthDay: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
  earthNight: 'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  earthClouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png',
  moon: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg',
}

const EARTH_RADIUS = 3.2
const HISAR_LAT = 29.1492
const HISAR_LON = 75.7217
const ISS_ORBIT_SPEED = 0.6
const MOON_ORBIT_SPEED = 0.15
const ISS_ALTITUDE = 4.8
const MOON_ALTITUDE = 6.5
const SUN_DIRECTION = new THREE.Vector3(5, 2, 5).normalize()

function getCartesian(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon - 90) * (Math.PI / 180) // Aligns coordinate math with the 8K texture
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

const hisarVector = getCartesian(HISAR_LAT, HISAR_LON, EARTH_RADIUS + 0.02)

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

function ResponsiveCamera() {
  const { camera, size } = useThree()
  useEffect(() => {
    if (size.width < 640) { camera.position.set(0, 0, 18); camera.fov = 50 } 
    else if (size.width < 1024) { camera.position.set(0, 0, 16); camera.fov = 47 } 
    else { camera.position.set(0, 0, 14); camera.fov = 45 }
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

// ----------------------------------------------------------------------------
// SYNCHRONIZED SCROLL HOOK (Keeps both canvases perfectly aligned)
// ----------------------------------------------------------------------------
function useParallaxAndZoom(groupRef) {
  const { mouse } = useThree()
  const scrollRef = useRef(0)
  const smoothedScroll = useRef(0)

  useEffect(() => {
    const fn = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useFrame(() => {
    if (!groupRef.current) return
    smoothedScroll.current = THREE.MathUtils.lerp(smoothedScroll.current, scrollRef.current, 0.03)
    // Synchronized Zoom
    groupRef.current.position.z = THREE.MathUtils.lerp(-2.0, 7.0, smoothedScroll.current)
    // Synchronized Mouse Parallax
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.08, 0.04)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.06, 0.04)
  })

  return smoothedScroll
}

// ----------------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------------

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

  useFrame(() => {
    const t = Date.now() * 0.001; // Uses standard JS time instead of Three.js clock
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = t
      pointsRef.current.rotation.y = t * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geoRef} />
      <shaderMaterial
        uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending}
        vertexShader={`
          uniform float uTime; attribute float aPhase; attribute float aSize; varying float vAlpha;
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
function RealisticEarth({ textures, placeholders, smoothedScroll }) {
  const earthGroupRef = useRef()
  const earthMatRef = useRef()
  const boundaryMatRef = useRef()
  const markerRef = useRef()

  const boundaryGeo = useMemo(() => {
    const pts = HISAR_BOUNDARY_POINTS.map(c => getCartesian(c[0], c[1], EARTH_RADIUS + 0.02))
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])

  const targetQ = useMemo(() => {
    // Brings Hisar to absolute dead-center facing the camera
    const targetEuler = new THREE.Euler(
      HISAR_LAT * (Math.PI / 180),
      (180 - HISAR_LON) * (Math.PI / 180),
      0,
      'YXZ'
    )
    return new THREE.Quaternion().setFromEuler(targetEuler)
  }, [])

  const uniforms = useMemo(() => ({
    tDay: { value: placeholders.day },
    tNight: { value: placeholders.night },
    tClouds: { value: placeholders.clouds },
    uSunDirection: { value: new THREE.Vector3(0, 0, 1) },
  }), [placeholders])

  useEffect(() => {
    if (earthMatRef.current && textures) {
      earthMatRef.current.uniforms.tDay.value = textures.day
      earthMatRef.current.uniforms.tNight.value = textures.night
      earthMatRef.current.uniforms.tClouds.value = textures.clouds
    }
  }, [textures])

  useFrame(() => {
    if (!earthGroupRef.current) return
    earthGroupRef.current.quaternion.copy(targetQ)
    
    // Real-time IST tracker for Day/Night shadow
    if (earthMatRef.current) {
      const now = new Date();
      const utcHours = now.getUTCHours() + (now.getUTCMinutes() / 60) + (now.getUTCSeconds() / 3600);
      let istHours = utcHours + 5.5;
      if (istHours >= 24) istHours -= 24;
      
      const angle = ((istHours - 12) / 24) * Math.PI * 2;
      const sunX = -Math.sin(angle);
      const sunZ = Math.cos(angle);
      const sunY = 0.15; 
      
      earthMatRef.current.uniforms.uSunDirection.value.set(sunX, sunY, sunZ).normalize();
    }

    const op = THREE.MathUtils.clamp((smoothedScroll.current - 0.5) * 4, 0, 1)
    if (boundaryMatRef.current) boundaryMatRef.current.opacity = op * 0.8
    if (markerRef.current) markerRef.current.style.opacity = op
  })

  return (
    <group ref={earthGroupRef}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 128, 128]} />
        <shaderMaterial 
          ref={earthMatRef} 
          uniforms={uniforms} 
          vertexShader={`varying vec2 vUv; varying vec3 vNormal; void main() { vUv = uv; vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
          fragmentShader={`
            uniform sampler2D tDay; 
            uniform sampler2D tNight; 
            uniform sampler2D tClouds; 
            uniform vec3 uSunDirection; 
            varying vec2 vUv; 
            varying vec3 vNormal; 
            
            void main() { 
              float sunLight = dot(vNormal, uSunDirection); 
              float dayMix = smoothstep(-0.05, 0.2, sunLight); 
              
              vec3 dayTex = texture2D(tDay, vUv).rgb; 
              vec3 nightTex = texture2D(tNight, vUv).rgb; 
              float cloudTex = texture2D(tClouds, vUv).r; 
              
              vec3 dayColor = dayTex * 0.8; 
              vec3 cityLights = pow(nightTex, vec3(3.0)) * vec3(3.0, 2.5, 1.5) * (1.0 - dayMix); 
              vec3 cloudColor = vec3(0.9) * cloudTex * dayMix; 
              
              vec3 earthBase = mix(vec3(0.0), dayColor, dayMix); 
              vec3 finalColor = mix(earthBase, cloudColor, cloudTex * 0.7) + cityLights; 
              
              gl_FragColor = vec4(finalColor, 1.0); 
            }
          `}
        />
      </mesh>
      
      <mesh scale={1.02}>
        <sphereGeometry args={[EARTH_RADIUS, 128, 128]} />
        <shaderMaterial blending={THREE.AdditiveBlending} transparent depthWrite={false}
          vertexShader={`varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
          fragmentShader={`
            varying vec3 vNormal; 
            void main() { 
              float f = clamp(1.0 - dot(vNormal, vec3(0, 0, 1.0)), 0.0, 1.0); 
              float intensity = pow(f, 5.0); 
              gl_FragColor = vec4(0.2, 0.5, 1.0, 1.0) * intensity * 0.8; 
            }
          `}
        />
      </mesh>
      
      <lineLoop>
        <primitive attach="geometry" object={boundaryGeo} />
        <lineBasicMaterial ref={boundaryMatRef} color="#22d3ee" transparent opacity={0} />
      </lineLoop>
      
      <Html position={[hisarVector.x, hisarVector.y, hisarVector.z]} center zIndexRange={[100, 0]}>
        <div ref={markerRef} style={{ opacity: 0, transition: 'opacity 0.5s' }} className="flex items-center gap-2 pointer-events-none">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.9)]" />
          <span className="font-mono text-[8px] text-cyan-400 uppercase tracking-widest drop-shadow-md">Hisar</span>
        </div>
      </Html>
    </group>
  )
}

// Find and replace these components in FluidBackground.js:

function Moon({ orbitRadius, texture, renderHalf = 'both', drawLine = true }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)

  const orbitalGeo = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 128; i++) { const t = (i / 128) * Math.PI * 2; arr.push(new THREE.Vector3(Math.cos(t) * orbitRadius, 0, Math.sin(t) * orbitRadius)) }
    return new THREE.BufferGeometry().setFromPoints(arr)
  }, [orbitRadius])

  useFrame(() => {
    // MAGIC FIX: Using Date.now() ensures absolute sync between both canvases
    const t = (Date.now() )* 0.0006 ;
    
    if (groupRef.current && meshRef.current) {
      const zPos = Math.sin(t) * orbitRadius
      groupRef.current.position.x = Math.cos(t) * orbitRadius
      groupRef.current.position.z = zPos
      groupRef.current.rotation.y = -t

      // Hide or show based on strict mathematical boundaries to prevent flickering
      if (renderHalf === 'front') meshRef.current.visible = zPos >= 0;
      else if (renderHalf === 'back') meshRef.current.visible = zPos < 0;
      else meshRef.current.visible = true;
    }
  })

  return (
    <group rotation={[Math.PI / 8, 0, Math.PI / 12]}>
      {drawLine && <line><primitive attach="geometry" object={orbitalGeo} /><lineBasicMaterial color="#ffffff" transparent opacity={0.12} /></line>}
      <group ref={groupRef}>
        <group ref={meshRef}>
          <mesh visible={false} onPointerOver={(e) => { e.stopPropagation(); setHover(true) }} onPointerOut={() => setHover(false)}>
            <sphereGeometry args={[1.0, 8, 8]} /><meshBasicMaterial />
          </mesh>
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
    </group>
  )
}

function ISS({ orbitRadius, renderHalf = 'both', drawLine = true }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)

  const issOrbitGeo = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 128; i++) { const t = (i / 128) * Math.PI * 2; arr.push(new THREE.Vector3(Math.cos(t) * orbitRadius, Math.sin(t) * (orbitRadius * 0.25), Math.sin(t) * orbitRadius)) }
    return new THREE.BufferGeometry().setFromPoints(arr)
  }, [orbitRadius])

  useFrame(() => {
    // MAGIC FIX: Date.now() syncs the ISS across both canvases perfectly
    const t = Date.now() * 0.0006;
    
    if (groupRef.current && meshRef.current) {
      const zPos = Math.sin(t) * orbitRadius
      groupRef.current.position.set(Math.cos(t) * orbitRadius, Math.sin(t) * (orbitRadius * 0.25), zPos)
      groupRef.current.lookAt(Math.cos(t + 0.1) * orbitRadius, Math.sin(t + 0.1) * (orbitRadius * 0.25), Math.sin(t + 0.1) * orbitRadius)

      if (renderHalf === 'front') meshRef.current.visible = zPos >= 0;
      else if (renderHalf === 'back') meshRef.current.visible = zPos < 0;
      else meshRef.current.visible = true;
    }
  })

  return (
    <group rotation={[Math.PI / 5, 0, -Math.PI / 8]}>
      {drawLine && <line><primitive attach="geometry" object={issOrbitGeo} /><lineBasicMaterial color="#ffffff" transparent opacity={0.12} /></line>}
      <group ref={groupRef}>
        <group ref={meshRef}>
          <mesh visible={false} onPointerOver={(e) => { e.stopPropagation(); setHover(true) }} onPointerOut={() => setHover(false)}>
            <sphereGeometry args={[1.0, 8, 8]} /><meshBasicMaterial />
          </mesh>
          <group scale={hovered ? 0.28 : 0.18}>
            <mesh rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.1, 0.1, 1.2, 16]} /><meshStandardMaterial color="#ffffff" metalness={0.8} /></mesh>
            <mesh><cylinderGeometry args={[0.05, 0.05, 3.0, 8]} /><meshStandardMaterial color="#888888" metalness={0.9} /></mesh>
            <mesh position={[0, 0, 0.3]}><boxGeometry args={[2.8, 0.02, 0.6]} /><meshStandardMaterial color="#0055ff" emissive={hovered ? '#00f0ff' : '#002266'} emissiveIntensity={hovered ? 1.5 : 0.4} metalness={0.9} /></mesh>
            <mesh position={[0, 0, -0.3]}><boxGeometry args={[2.8, 0.02, 0.6]} /><meshStandardMaterial color="#0055ff" emissive={hovered ? '#00f0ff' : '#002266'} emissiveIntensity={hovered ? 1.5 : 0.4} metalness={0.9} /></mesh>
          </group>
          {hovered && (
            <Html position={[0, 0.5, 0]} center zIndexRange={[100, 0]}>
              <div className="font-mono text-[10px] text-cyan-400 bg-black/80 px-3 py-1.5 border border-cyan-400/50 uppercase tracking-widest backdrop-blur-md whitespace-nowrap rounded-sm pointer-events-none" style={{ boxShadow: '0 0 15px rgba(0,240,255,0.4)' }}>
                ISS (Zarya)<div className="text-[8px] text-white/50 mt-1">Velocity: 7.66 km/s</div>
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  )
}

function EarthScene({ textures, placeholders }) {
  const groupRef = useRef()
  const smoothedScroll = useParallaxAndZoom(groupRef)
  return (
    <group ref={groupRef}>
      <directionalLight position={[5, 2, 5]} intensity={2.0} color="#ffffff" />
      <ambientLight intensity={0.05} />
      <TwinklingStars count={5000} />
      <RealisticEarth textures={textures} placeholders={placeholders} smoothedScroll={smoothedScroll} />
      {/* Renders orbit lines and BACK half of the orbit */}
      <Moon orbitRadius={MOON_ALTITUDE} texture={textures?.moon || null} renderHalf="back" drawLine={true} />
      <ISS orbitRadius={ISS_ALTITUDE} renderHalf="back" drawLine={true} />
    </group>
  )
}

function OrbitScene({ textures }) {
  const groupRef = useRef()
  useParallaxAndZoom(groupRef) 
  return (
    <group ref={groupRef}>
      <directionalLight position={[5, 2, 5]} intensity={2.0} color="#ffffff" />
      <ambientLight intensity={0.05} />
      {/* Renders ONLY the FRONT half of the orbit (no lines) */}
      <Moon orbitRadius={MOON_ALTITUDE} texture={textures?.moon || null} renderHalf="front" drawLine={false} />
      <ISS orbitRadius={ISS_ALTITUDE} renderHalf="front" drawLine={false} />
    </group>
  )
}

export default function FluidBackground() {
  const textures = useAsyncTextures()
  const placeholders = useMemo(() => ({
    day: makePlaceholder('#001122'), night: makePlaceholder('#000000'), clouds: makePlaceholder('#000000'),
  }), [])

  return (
    <>
      {/* 1. BACKGROUND CANVAS (z-[1]) - Earth & Stars render BEHIND the Hero Text */}
      <div className="fixed inset-0 z-[1] bg-[#010103]" style={{ pointerEvents: 'auto' }}>
        {!textures && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="font-mono text-cyan-400 text-xs tracking-widest uppercase animate-pulse">Initializing Telemetry...</div>
          </div>
        )}
        <Canvas camera={{ position: [0, 0, 14], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
          <ResponsiveCamera />
          <EarthScene textures={textures} placeholders={placeholders} />
          <EffectComposer disableNormalPass multisampling={0}>
          <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.8} intensity={0.8} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={1.1} />
        </EffectComposer>
        </Canvas>
      </div>

      {/* 2. FOREGROUND CANVAS (z-[10]) - ISS & Moon render IN FRONT of the Hero Text */}
      <div className="fixed inset-0 z-[10] pointer-events-none">
        <Canvas camera={{ position: [0, 0, 14], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
          <ResponsiveCamera />
          <OrbitScene textures={textures} />
          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur />
          </EffectComposer>
        </Canvas>
      </div>
    </>
  )
}