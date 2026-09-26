"use client"

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" })
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" })
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" })
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" })

    const onMouseMove = (e) => {
      ringX(e.clientX)
      ringY(e.clientY)
      dotX(e.clientX)
      dotY(e.clientY)
    }

    const onHoverEnter = () => {
      gsap.to(ring, { scale: 2.5, borderColor: 'rgba(0, 240, 255, 0.8)', boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)', duration: 0.3, ease: "power2.out" })
      gsap.to(dot, { scale: 0, duration: 0.3 })
    }

    const onHoverLeave = () => {
      gsap.to(ring, { scale: 1, borderColor: 'rgba(0, 240, 255, 0.3)', boxShadow: '0 0 6px rgba(0, 240, 255, 0.15)', duration: 0.3, ease: "power2.out" })
      gsap.to(dot, { scale: 1, duration: 0.3 })
    }

    window.addEventListener('mousemove', onMouseMove)
    const interactives = document.querySelectorAll('a, button, [role="button"], .magnetic')
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onHoverEnter)
      el.addEventListener('mouseleave', onHoverLeave)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onHoverEnter)
        el.removeEventListener('mouseleave', onHoverLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-screen hidden md:block" style={{ border: '1px solid rgba(0, 240, 255, 0.3)', boxShadow: '0 0 6px rgba(0, 240, 255, 0.15)' }} />
      <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-screen hidden md:block" style={{ backgroundColor: '#00f0ff', boxShadow: '0 0 8px #00f0ff, 0 0 16px rgba(0, 240, 255, 0.4)' }} />
    </>
  )
}