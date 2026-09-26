"use client"

import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugin globally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth friction
      smoothWheel: true,
    })

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Add Lenis requestAnimationFrame to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    
    // Disable GSAP lag smoothing to prevent jitter with Lenis
    gsap.ticker.lagSmoothing(0)

    // Cleanup on unmount
    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  return <>{children}</>
}