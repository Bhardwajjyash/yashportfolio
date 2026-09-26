"use client"

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '@/store/useStore'

export default function Preloader() {
  const { isLoading, setLoading } = useStore()
  const containerRef = useRef(null)
  const counterRef = useRef(null)
  const textRef = useRef(null)
  const beamRef = useRef(null)

  useEffect(() => {
    if (!isLoading) return
    document.body.style.overflow = 'hidden'

    const counter = { value: 0 }
    const statuses = [
      "INITIALIZING NEURAL INTERFACE...",
      "CALIBRATING HOLOGRAPHIC ARRAY...",
      "LOADING ASSET REGISTRY...",
      "DECRYPTING ARCHIVES...",
      "INTERFACE READY.",
    ]

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.style.overflow = ''
            setLoading(false)
          },
        })
      },
    })

    tl.to(counter, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = Math.round(counter.value).toString().padStart(3, '0') + '%'
        if (textRef.current) {
          const idx = Math.floor((counter.value / 100) * (statuses.length - 1))
          textRef.current.textContent = statuses[idx]
        }
      },
    })

    tl.fromTo(beamRef.current, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 2.5, ease: 'power2.inOut' }, 0)

    return () => { tl.kill(); document.body.style.overflow = '' }
  }, [isLoading, setLoading])

  if (!isLoading) return null

  return (
    <div ref={containerRef} className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-void">
      <div className="relative flex flex-col items-center w-full max-w-lg px-8">
        <div className="w-full flex justify-between items-end mb-4">
          <span className="font-mono text-xs tracking-widest text-cyan uppercase animate-pulse">Boot.Seq //</span>
          <span ref={textRef} className="font-mono text-[10px] tracking-widest text-cyan/70 uppercase">SYSTEM STANDBY...</span>
        </div>
        <div className="w-full relative overflow-hidden border border-cyan/20 bg-cyan/5 p-8 glass-panel hud-corners">
          <span ref={counterRef} className="font-display text-6xl md:text-8xl leading-none text-cyan text-glow tabular-nums tracking-widest">000%</span>
        </div>
        <div className="w-full h-1 bg-cyan/10 mt-8 relative overflow-hidden rounded-full">
          <div ref={beamRef} className="absolute top-0 left-0 h-full w-full bg-cyan" style={{ boxShadow: '0 0 15px rgba(0, 240, 255, 0.8)' }} />
        </div>
      </div>
    </div>
  )
}
