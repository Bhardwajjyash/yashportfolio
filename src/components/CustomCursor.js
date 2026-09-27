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

    const ringX = gsap.quickTo(ring, "x", { duration: 0.3, ease: "power3" })
    const ringY = gsap.quickTo(ring, "y", { duration: 0.3, ease: "power3" })
    const dotX = gsap.quickTo(dot, "x", { duration: 0.05, ease: "none" })
    const dotY = gsap.quickTo(dot, "y", { duration: 0.05, ease: "none" })

    const onMouseMove = (e) => {
      ringX(e.clientX)
      ringY(e.clientY)
      dotX(e.clientX)
      dotY(e.clientY)
    }

    const onHoverEnter = () => {
      gsap.to(ring, { scale: 1.5, rotate: 45, borderRadius: '0%', borderColor: '#00f0ff', borderWidth: '1px', boxShadow: '0 0 15px rgba(0,240,255,0.5)', duration: 0.3, ease: "back.out(1.7)" })
      gsap.to(dot, { scale: 3, backgroundColor: 'transparent', border: '1px solid #ffffff', duration: 0.3 })
    }

    const onHoverLeave = () => {
      gsap.to(ring, { scale: 1, rotate: 0, borderRadius: '50%', borderColor: 'rgba(0, 240, 255, 0.4)', borderWidth: '1px', boxShadow: '0 0 0px transparent', duration: 0.3, ease: "power2.out" })
      gsap.to(dot, { scale: 1, backgroundColor: '#00f0ff', border: 'none', duration: 0.3 })
    }

    window.addEventListener('mousemove', onMouseMove)
    const interactives = document.querySelectorAll('a, button, [role="button"], .magnetic, .skill-chip')
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
      <div ref={ringRef} className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen hidden md:flex justify-center items-center" style={{ border: '1px solid rgba(0, 240, 255, 0.4)' }}>
        <div className="absolute w-full h-[1px] bg-cyan/30" />
        <div className="absolute h-full w-[1px] bg-cyan/30" />
      </div>
      <div ref={dotRef} className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block" style={{ backgroundColor: '#00f0ff', boxShadow: '0 0 10px #00f0ff' }} />
    </>
  )
}