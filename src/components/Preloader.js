"use client"

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useStore } from '@/store/useStore'

export default function Preloader() {
  const { isLoading, setLoading } = useStore()
  const containerRef = useRef(null)
  const counterRef = useRef(null)
  const ringRef = useRef(null)
  const textRef = useRef(null)

  useEffect(() => {
    if (!isLoading) return
    document.body.style.overflow = 'hidden'

    const counter = { value: 0 }
    const statuses = [
      "CALIBRATING KERNEL",
      "ESTABLISHING SECURE UPLINK",
      "RENDERING HOLOGRAPHICS",
      "SYSTEM READY",
    ]

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          scale: 1.1,
          duration: 1.2,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.style.overflow = ''
            setLoading(false)
          },
        })
      },
    })

    // Circumference of a circle with r=63 is ~395.84
    tl.to(counter, {
      value: 100,
      duration: 3,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(counter.value).toString().padStart(3, '0')
        }
        if (ringRef.current) {
          const progress = 396 - (counter.value / 100) * 396
          ringRef.current.style.strokeDashoffset = progress
        }
        if (textRef.current) {
          const idx = Math.floor((counter.value / 100) * (statuses.length - 1))
          textRef.current.textContent = statuses[idx]
        }
      },
    })

    return () => { 
      tl.kill()
      document.body.style.overflow = '' 
    }
  }, [isLoading, setLoading])

  if (!isLoading) return null

  return (
    <div ref={containerRef} className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-void text-cyan">
      <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />
      
      <div className="relative flex flex-col items-center z-10">
        {/* Minimalist Calibration Ring */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <circle cx="80" cy="80" r="63" stroke="rgba(0, 240, 255, 0.1)" strokeWidth="1" fill="none" />
            <circle 
              ref={ringRef} 
              cx="80" cy="80" r="63" 
              stroke="#00f0ff" 
              strokeWidth="1.5" 
              fill="none" 
              strokeDasharray="396" 
              strokeDashoffset="396" 
              strokeLinecap="round"
            />
          </svg>
          <div className="flex items-start">
            <span ref={counterRef} className="font-mono text-3xl text-white tracking-widest tabular-nums">000</span>
            <span className="font-mono text-[10px] text-cyan/50 mt-1">%</span>
          </div>
        </div>
        
        <span ref={textRef} className="mt-8 font-mono text-[9px] tracking-[0.5em] text-cyan/70 uppercase">
          INITIALIZING...
        </span>
      </div>
    </div>
  )
}