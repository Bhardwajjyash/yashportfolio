"use client"

import { useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomCursor from '@/components/CustomCursor'
import Preloader from '@/components/Preloader'
import { useStore } from '@/store/useStore'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const FluidBackground = dynamic(() => import('@/components/FluidBackground'), { ssr: false })

const projects = [
  { title: 'BhejaFry', subtitle: 'bhejafry.fun', description: 'Real-time multiplayer trivia application featuring live leaderboards and robust architectural deployment.', tech: ['React.js', 'Socket.io', 'PostgreSQL', 'Prisma', 'Redis', 'Docker'], link: 'https://bhejafry.fun' },
  { title: 'Yash.Album', subtitle: 'Photography Platform', description: 'Dark-themed social media application engineered for photographers, with Redux Toolkit and Cloudinary image processing.', tech: ['Next.js', 'Tailwind', 'MongoDB', 'Express', 'Redux'], link: '#' },
  { title: 'AI Vision Systems', subtitle: 'Computer Vision', description: 'Dual architecture: Foggy Vehicle Detection via image dehazing, and CNN-based Plant Disease classifier.', tech: ['Python', 'TensorFlow', 'OpenCV', 'Pandas'], link: '#' },
  { title: 'Produtrix', subtitle: 'Analytics Engine', description: 'Data-driven productivity suite for tracking study sessions and deep calendar analytics via Google OAuth2.', tech: ['Express', 'Prisma', 'Google OAuth2'], link: '#' },
]

const skills = ['C++', 'Python', 'JavaScript', 'React.js', 'Next.js', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Prisma ORM', 'Redis', 'Docker', 'Linux Mint']

export default function Home() {
  const containerRef = useRef(null)
  const horizontalSectionRef = useRef(null)
  const horizontalScrollRef = useRef(null)
  const ctaButtonRef = useRef(null)
  const projectRefs = useRef([])
  const isLoading = useStore((state) => state.isLoading)

  const handleCardTilt = useCallback((e, el) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, duration: 0.4, ease: 'power2.out', transformPerspective: 800 })
  }, [])

  const resetCardTilt = useCallback((el) => {
    if (!el) return
    gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' })
  }, [])

  const handleMagnetic = useCallback((e, el, strength = 0.3) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    gsap.to(el, { x: (e.clientX - (rect.left + rect.width / 2)) * strength, y: (e.clientY - (rect.top + rect.height / 2)) * strength, duration: 0.4, ease: 'power2.out' })
  }, [])

  const resetMagnetic = useCallback((el) => {
    if (!el) return
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' })
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (horizontalScrollRef.current && horizontalSectionRef.current) {
        const scrollWidth = horizontalScrollRef.current.scrollWidth
        const windowWidth = window.innerWidth
        gsap.to(horizontalScrollRef.current, {
          x: () => -(scrollWidth - windowWidth),
          ease: 'none',
          scrollTrigger: { trigger: horizontalSectionRef.current, start: 'top top', end: () => `+=${scrollWidth}`, scrub: 1, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
        })
      }

      gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.fromTo(item, { opacity: 0, y: 50, x: -20 }, { opacity: 1, y: 0, x: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 88%' } })
      })

      gsap.utils.toArray('.skill-chip').forEach((chip, i) => {
        gsap.fromTo(chip, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, delay: i * 0.04, ease: 'back.out(1.7)', scrollTrigger: { trigger: chip, start: 'top 92%' } })
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (isLoading) return
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray('.hero-char')
      gsap.fromTo(chars, { y: '120%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.2, stagger: 0.04, ease: 'power4.out' })
      gsap.fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 })
      gsap.fromTo('.hero-status', { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.15, delay: 1.2 })
      gsap.fromTo('.hero-desc', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1 })
      gsap.fromTo('.nav-item', { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 1.5 })
      gsap.fromTo('.footer-title', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: '.footer-title', start: 'top 85%' } })
      gsap.fromTo('.footer-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.footer-cta', start: 'top 90%' } })
    }, containerRef)
    return () => ctx.revert()
  }, [isLoading])

  return (
    <main ref={containerRef} className="relative w-full min-h-screen font-sans">
      <CustomCursor />
      <FluidBackground />
      <Preloader />

      <nav className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 pointer-events-none">
        <div className="nav-item flex flex-col opacity-0">
          <span className="font-display text-sm tracking-[0.15em] uppercase text-cyan text-glow">Yash Bhardwaj</span>
          <span className="font-mono text-[10px] tracking-widest text-cyan/50 uppercase mt-1">Creative Developer</span>
        </div>
        <div className="nav-item flex items-center gap-6 opacity-0">
          <span className="font-mono text-[10px] tracking-widest text-cyan/50 uppercase">Delhi, India</span>
          <div className="w-2 h-2 rounded-full bg-cyan pulse-dot" />
        </div>
      </nav>

      <div className="relative z-10 w-full">
        {/* HERO */}
        <section className="h-screen w-full flex flex-col justify-center items-center relative px-6">
          <div className="text-center relative z-10">
            <div className="overflow-hidden">
              <h1 className="font-display text-[10vw] md:text-[7vw] leading-none tracking-wider uppercase text-glow">
                {'YASH'.split('').map((c, i) => (<span key={`y-${i}`} className="hero-char inline-block opacity-0 text-white">{c}</span>))}
                <span className="hero-char inline-block opacity-0">&nbsp;</span>
                {'BHARDWAJ'.split('').map((c, i) => (<span key={`b-${i}`} className="hero-char inline-block opacity-0 text-white">{c}</span>))}
              </h1>
            </div>
            <p className="hero-subtitle font-mono text-sm md:text-base tracking-[0.4em] text-cyan/80 uppercase mt-6 opacity-0">Creative Developer &amp; Software Engineer</p>
          </div>

          <div className="absolute bottom-16 left-6 md:left-12 flex flex-col gap-2">
            <span className="hero-status font-mono text-[10px] tracking-widest text-cyan/40 opacity-0">SYS.STATUS: <span className="text-cyan">ACTIVE</span></span>
            <span className="hero-status font-mono text-[10px] tracking-widest text-cyan/40 opacity-0">EDU: GGSIPU &bull; B.TECH IT &bull; 2023—2027</span>
          </div>
          <div className="absolute bottom-16 right-6 md:right-12 max-w-xs hero-desc opacity-0">
            <p className="font-sans text-sm leading-relaxed text-white/60">Specializing in full-stack engineering, agentic AI architectures, and immersive 3D web experiences.</p>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hero-status opacity-0">
            <span className="font-mono text-[9px] tracking-[0.3em] text-cyan/30 uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-cyan/40 to-transparent" />
          </div>
        </section>

        {/* PROJECTS */}
        <section ref={horizontalSectionRef} className="h-screen w-full overflow-hidden flex items-center relative z-20">
          <div className="absolute top-12 left-6 md:left-12 z-30">
            <span className="font-mono text-[10px] tracking-[0.3em] text-amber uppercase text-glow-amber">01 // Archive</span>
            <h2 className="font-display text-xl md:text-2xl tracking-wider uppercase text-glow mt-2">Featured Work</h2>
          </div>
          <div ref={horizontalScrollRef} className="flex h-[70vh] items-center px-6 md:px-24 gap-8 md:gap-16 w-max pointer-events-auto">
            {projects.map((project, i) => (
              <div key={project.title} ref={(el) => { projectRefs.current[i] = el }} className={`w-[85vw] md:w-[55vw] h-full flex flex-col justify-center relative ${i === projects.length - 1 ? 'mr-24' : ''}`} onMouseMove={(e) => handleCardTilt(e, projectRefs.current[i])} onMouseLeave={() => resetCardTilt(projectRefs.current[i])} style={{ transformStyle: 'preserve-3d' }}>
                <div className="w-full h-[55%] glass-panel hud-corners relative overflow-hidden flex items-center justify-center group transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 via-transparent to-transparent h-1/3 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="absolute top-4 left-4 font-mono text-xs text-cyan/30">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-2xl md:text-3xl text-cyan/10 uppercase tracking-wider group-hover:text-cyan/25 transition-colors duration-700">{project.subtitle}</span>
                </div>
                <div className="mt-6 flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-2xl md:text-4xl text-white tracking-wider uppercase text-glow">{project.title}</h3>
                    <p className="font-sans text-white/50 max-w-md text-sm leading-relaxed mt-2">{project.description}</p>
                    {project.link !== '#' && (<a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-mono text-xs text-cyan mt-4 hover:text-white transition-colors"><span>ACCESS</span><span>→</span></a>)}
                  </div>
                  <div className="text-right hidden md:flex flex-col gap-1">
                    {project.tech.map((t) => (<span key={t} className="font-mono text-[10px] tracking-widest text-cyan/40 uppercase">{t}</span>))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="min-h-screen w-full px-6 md:px-24 py-32 relative z-10">
          <div className="mb-16">
            <span className="font-mono text-[10px] tracking-[0.3em] text-amber uppercase text-glow-amber">02 // System</span>
            <h2 className="font-display text-xl md:text-2xl tracking-wider uppercase text-glow mt-2">Capabilities</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-24">
            <div className="w-full md:w-1/2 flex flex-col gap-8">
              <div className="timeline-item glass-panel p-6 hud-corners">
                <span className="font-mono text-[10px] tracking-widest text-amber/70 uppercase mb-2 block">Aug 2023 — Jul 2027</span>
                <h4 className="font-display text-lg tracking-wider uppercase text-glow">B.Tech Information Technology</h4>
                <p className="font-sans text-sm text-white/50 mt-2">Guru Gobind Singh Indraprastha University (GGSIPU). Algorithms, scalable systems, and applied AI.</p>
              </div>
              <div className="timeline-item glass-panel p-6 hud-corners">
                <span className="font-mono text-[10px] tracking-widest text-amber/70 uppercase mb-2 block">2024</span>
                <h4 className="font-display text-lg tracking-wider uppercase text-glow">Smart India Hackathon</h4>
                <p className="font-sans text-sm text-white/50 mt-2">Qualified the internal round of SIH 2024, competing among 150+ elite development teams.</p>
              </div>
              <div className="timeline-item glass-panel p-6 hud-corners">
                <span className="font-mono text-[10px] tracking-widest text-amber/70 uppercase mb-2 block">2026</span>
                <h4 className="font-display text-lg tracking-wider uppercase text-glow">BPIT Achievement Portal</h4>
                <p className="font-sans text-sm text-white/50 mt-2">Engineered the Student Achievement Management System for the IT department at BPIT.</p>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h4 className="font-mono text-[10px] tracking-widest text-cyan/50 uppercase mb-8">Technical Arsenal</h4>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (<div key={skill} className="skill-chip glass-panel px-4 py-2 font-mono text-sm text-cyan/80 hover:text-cyan hover:border-cyan/30 transition-all duration-300 opacity-0">{skill}</div>))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <footer className="h-[70vh] w-full flex flex-col items-center justify-center pointer-events-auto relative z-10 border-t border-cyan/10">
          <span className="font-mono text-[10px] tracking-[0.3em] text-amber uppercase text-glow-amber mb-4">03 // Communication</span>
          <h2 className="footer-title font-display text-4xl md:text-7xl tracking-wider uppercase text-glow">Initiate Contact</h2>
          <a ref={ctaButtonRef} href="mailto:hello@example.com" className="footer-cta magnetic mt-12 font-mono text-sm tracking-[0.3em] uppercase border border-cyan/30 px-12 py-5 hover:bg-cyan/10 hover:border-cyan text-glow transition-all duration-500" onMouseMove={(e) => handleMagnetic(e, ctaButtonRef.current, 0.25)} onMouseLeave={() => resetMagnetic(ctaButtonRef.current)}>Send Transmission →</a>
        </footer>
      </div>
    </main>
  )
}