"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomCursor from '@/components/CustomCursor'
import Preloader from '@/components/Preloader'
import { useStore } from '@/store/useStore'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Dynamically load the WebGL background to prevent SSR issues
const FluidBackground = dynamic(() => import('@/components/FluidBackground'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#010103] z-[-1]" />
})

// ============================================================================
// COMPREHENSIVE DATA ARCHITECTURE
// ============================================================================

const PROJECTS_DATA = [
  { 
    id: '01', 
    title: 'BhejaFry', 
    subtitle: 'TRIVIA.ENGINE', 
    description: 'Real-time multiplayer trivia application. Engineered with robust WebSockets for live leaderboards and zero-latency state synchronization across distributed clients.', 
    tech: ['React.js', 'Socket.io', 'PostgreSQL', 'Prisma', 'Redis', 'Docker'], 
    link: 'https://bhejafry.fun',
    metrics: { deployment: 'Docker/MinIO', latency: '<50ms', db: 'PostgreSQL' }
  },
  { 
    id: '02', 
    title: 'Yash.Album', 
    subtitle: 'MEDIA.MATRIX', 
    description: 'A dark-themed social media matrix specifically engineered for photographers. Features heavy image processing via Cloudinary and complex global state managed by Redux Toolkit.', 
    tech: ['Next.js', 'Tailwind', 'MongoDB', 'Express', 'Redux'], 
    link: 'https://github.com/bhardwajjyash',
    metrics: { state: 'Redux Toolkit', cdn: 'Cloudinary', stack: 'MERN' }
  },
  { 
    id: '03', 
    title: 'Foggy Vehicle Detect', 
    subtitle: 'COMPUTER.VISION', 
    description: 'Custom image dehazing algorithms and dataset processing pipelines to detect and draw bounding boxes on weather-degraded video feeds.', 
    tech: ['Python', 'OpenCV', 'Pandas', 'NumPy'], 
    link: 'https://github.com/bhardwajjyash',
    metrics: { algo: 'Custom Dehaze', arrays: 'NumPy', visuals: 'OpenCV' }
  },
  { 
    id: '04', 
    title: 'Plant Disease CNN', 
    subtitle: 'NEURAL.NET', 
    description: 'Convolutional Neural Network built from scratch to classify plant diseases from leaf imagery, served via a Streamlit interface.', 
    tech: ['TensorFlow', 'Keras', 'OpenCV', 'Streamlit'], 
    link: 'https://github.com/bhardwajjyash',
    metrics: { architecture: 'CNN', serving: 'Streamlit', accuracy: 'High' }
  },
  { 
    id: '05', 
    title: 'SAMS Portal', 
    subtitle: 'SYS.ARCHITECTURE', 
    description: 'Student Achievement Management System engineered for the BPIT IT department. A structural digitization of academic tracking with secure role-based access.', 
    tech: ['React', 'Node.js', 'Express', 'MongoDB'], 
    link: 'https://github.com/bhardwajjyash',
    metrics: { client: 'BPIT Dept', auth: 'Role-Based', type: 'Full-Stack' }
  },
  { 
    id: '06', 
    title: 'Produtrix', 
    subtitle: 'DATA.ANALYTICS', 
    description: 'Data-driven productivity suite bridging study session tracking with deep calendar analytics via seamless Google OAuth2 integration and Prisma ORM schemas.', 
    tech: ['Express', 'Prisma', 'OAuth2', 'React'], 
    link: 'https://github.com/bhardwajjyash',
    metrics: { auth: 'Google OAuth2', orm: 'Prisma', sync: 'Real-time' }
  },
]

const SKILLS_MATRIX = [
  'C++', 'Python', 'JavaScript', 'React.js', 'Next.js', 'Node.js', 
  'Express.js', 'PostgreSQL', 'MongoDB', 'Prisma ORM', 'Redis', 
  'Docker', 'Linux Mint', 'TensorFlow', 'OpenCV', 'WebGL'
]

// ============================================================================
// DEVELOPER TERMINAL COMPONENT (INTERACTIVE LINUX MINT THEME)
// ============================================================================

const DeveloperTerminal = () => {
  const [typedText, setTypedText] = useState('')
  const [showOutput, setShowOutput] = useState(false)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const fullCommand = "cat contact_links.json"
  
  useEffect(() => {
    let currentText = ''
    let currentIndex = 0
    
    ScrollTrigger.create({
      trigger: "#terminal-section",
      start: "top 70%",
      onEnter: () => {
        const typeInterval = setInterval(() => {
          if (currentIndex < fullCommand.length) {
            currentText += fullCommand[currentIndex]
            setTypedText(currentText)
            currentIndex++
          } else {
            clearInterval(typeInterval)
            setTimeout(() => {
              setShowOutput(true)
              setTimeout(() => inputRef.current?.focus(), 100)
            }, 400)
          }
        }, 100)
      }
    })
  }, [])

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.trim()
      const cmdLower = cmd.toLowerCase()
      let response = ''
      
      if (cmdLower === 'wget resume.pdf' || cmdLower === 'download resume.pdf' || cmdLower === 'get resume') {
        response = 'Status: 200 OK. Downloading Yash_Bhardwaj_Resume.pdf...'
        const link = document.createElement('a')
        link.href = '/resume.pdf' 
        link.download = 'Yash_Bhardwaj_Resume.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } 
      else if (cmd === '') {
        response = ''
      } 
      else {
        response = `bash: ${cmd}: command not found. (Hint: look at the system instructions)`
      }

      setHistory([...history, { cmd, response }])
      setInput('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <div 
      id="terminal-section" 
      className="w-full max-w-3xl mx-auto terminal-window mt-12 cursor-text pointer-events-auto shadow-2xl relative z-50 bg-[#1a1b26]/90 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden" 
      onClick={() => inputRef.current?.focus()}
    >
      <div className="terminal-header pointer-events-none bg-[#16161e] px-4 py-3 flex items-center border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
        <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
        <span className="font-mono text-[10px] text-gray-400 ml-4">yash@linux-mint: ~</span>
      </div>
      
      <div className="p-6 font-mono text-sm md:text-base text-gray-300 min-h-[300px] flex flex-col">
        <div className="flex items-center mb-4 pointer-events-none">
          <span className="text-green-400 mr-2">yash@linux-mint:~$</span>
          <span>{typedText}</span>
          {!showOutput && <span className="terminal-cursor inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
        </div>
        
        {showOutput && (
          <div className="animate-fade-in flex flex-col gap-4 w-full">
            <div className="text-cyan-400 flex flex-col gap-2 pl-4 border-l-2 border-gray-700 ml-2">
              <span className="text-gray-400 pointer-events-none">{"{"}</span>
              
              <a href="https://github.com/bhardwajjyash" target="_blank" rel="noreferrer" className="hover:text-white flex items-center magnetic cursor-none pointer-events-auto w-max" data-strength="0.2">
                <span className="text-pink-400 w-28">"GitHub":</span> 
                <span className="text-green-300">"github.com/bhardwajjyash"</span>,
              </a>
              
              <a href="https://linkedin.com/in/bhardwajjyash" target="_blank" rel="noreferrer" className="hover:text-white flex items-center magnetic cursor-none pointer-events-auto w-max" data-strength="0.2">
                <span className="text-pink-400 w-28">"LinkedIn":</span> 
                <span className="text-green-300">"linkedin.com/in/bhardwajjyash"</span>,
              </a>
              
              <a href="https://instagram.com/bhardwajj_yash" target="_blank" rel="noreferrer" className="hover:text-white flex items-center magnetic cursor-none pointer-events-auto w-max" data-strength="0.2">
                <span className="text-pink-400 w-28">"Instagram":</span> 
                <span className="text-green-300">"@bhardwajj_yash"</span>,
              </a>

              <div className="mt-2 pt-2 border-t border-gray-700 border-dashed w-3/4 pointer-events-none"></div>
              <span className="text-gray-500 text-xs pointer-events-none">// Competitive Programming Profiles</span>
              
              <a href="https://leetcode.com/u/bhardwajj_yash" target="_blank" rel="noreferrer" className="hover:text-white flex items-center magnetic cursor-none pointer-events-auto w-max" data-strength="0.2">
                <span className="text-pink-400 w-28">"LeetCode":</span> 
                <span className="text-green-300">"leetcode.com/bhardwajj_yash"</span>,
              </a>
              
              <a href="https://codeforces.com/profile/bhardwajjyash" target="_blank" rel="noreferrer" className="hover:text-white flex items-center magnetic cursor-none pointer-events-auto w-max" data-strength="0.2">
                <span className="text-pink-400 w-28">"Codeforces":</span> 
                <span className="text-green-300">"codeforces.com/profile/bhardwajjyash"</span>,
              </a>

              <a href="https://atcoder.jp/users/bhardwajj_yash" target="_blank" rel="noreferrer" className="hover:text-white flex items-center magnetic cursor-none pointer-events-auto w-max" data-strength="0.2">
                <span className="text-pink-400 w-28">"AtCoder":</span> 
                <span className="text-green-300">"atcoder.jp/users/bhardwajj_yash"</span>,
              </a>

              <a href="https://www.codechef.com/users/bhardwajj_yash" target="_blank" rel="noreferrer" className="hover:text-white flex items-center magnetic cursor-none pointer-events-auto w-max" data-strength="0.2">
                <span className="text-pink-400 w-28">"CodeChef":</span> 
                <span className="text-green-300">"codechef.com/users/bhardwajj_yash"</span>
              </a>

              <span className="text-gray-400 pointer-events-none">{"}"}</span>
            </div>

            {history.map((h, i) => (
              <div key={i} className="flex flex-col mt-2 pointer-events-none">
                <div className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-2 whitespace-nowrap">yash@linux-mint:~$</span>
                  <span>{h.cmd}</span>
                </div>
                {h.response && (
                  <span className={`ml-2 mt-1 ${h.response.includes('200 OK') ? 'text-cyan-400' : 'text-red-400'}`}>{h.response}</span>
                )}
              </div>
            ))}

            <div className="flex flex-col mt-4 border-t border-gray-800 pt-4">
              <span className="text-gray-500 text-xs mb-3 flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                SYSTEM HINT: To download my resume, execute: <span className="text-cyan-400 font-bold px-1 rounded bg-cyan-400/10">wget resume.pdf</span>
              </span>
              <div className="flex items-center text-gray-300 w-full relative">
                <span className="text-green-400 mr-2 whitespace-nowrap pointer-events-none">yash@linux-mint:~$</span>
                <input 
                  ref={inputRef}
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleCommand}
                  className="bg-transparent border-none outline-none text-white w-full flex-1 font-mono caret-cyan-400 focus:ring-0 p-0 m-0 relative z-50 pointer-events-auto"
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// MAIN SYSTEM COMPONENT
// ============================================================================

export default function Home() {
  const containerRef = useRef(null)
  const horizontalSectionRef = useRef(null)
  const horizontalScrollRef = useRef(null)
  const modalRef = useRef(null)
  const modalScrollAreaRef = useRef(null)
  
  const macAssemblyRef = useRef(null)
  const macLidRef = useRef(null)
  const projectRefs = useRef([])
  
  const [activeProject, setActiveProject] = useState(null)
  const [modalMounted, setModalMounted] = useState(false) 
  const [isBooting, setIsBooting] = useState(false)
  const [showIframe, setShowIframe] = useState(false)
  
  const isLoading = useStore((state) => state.isLoading)

  const handleCardTilt = useCallback((e, el) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    gsap.to(el, { rotateY: x * 8, rotateX: -y * 8, duration: 0.5, ease: 'power3.out', transformPerspective: 1200 })
  }, [])

  const resetCardTilt = useCallback((el) => {
    if (!el) return
    gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
  }, [])

  const handleMagnetic = useCallback((e, el) => {
    if (!el) return
    const strength = el.getAttribute('data-strength') || 0.4
    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    gsap.to(el, { x: (e.clientX - centerX) * strength, y: (e.clientY - centerY) * strength, duration: 0.5, ease: 'power3.out' })
  }, [])

  const resetMagnetic = useCallback((el) => {
    if (!el) return
    gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
  }, [])

  const openProject = useCallback((project) => {
    document.body.style.overflow = 'hidden'
    setShowIframe(false)
    setIsBooting(true)
    setActiveProject(project)
    setModalMounted(true)
  }, [])

  const closeProject = useCallback(() => {
    setShowIframe(false)
    const tl = gsap.timeline({
      onComplete: () => {
        setActiveProject(null)
        setModalMounted(false)
        document.body.style.overflow = ''
      }
    })
    
    tl.to('.modal-data-reveal', { y: 20, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power2.in' })
    tl.to(macLidRef.current, { rotationX: -90, duration: 0.8, ease: 'power3.inOut' }, "-=0.2")
    tl.to(macAssemblyRef.current, { z: -4000, rotationY: 720, scale: 0.1, opacity: 0, duration: 1.5, ease: 'expo.inOut' }, "-=0.4")
    tl.to(modalRef.current, { opacity: 0, backdropFilter: 'blur(0px)', pointerEvents: 'none', duration: 0.6 }, "-=0.8")
  }, [])

  useEffect(() => {
    if (modalMounted && macAssemblyRef.current && macLidRef.current) {
      const tl = gsap.timeline()
      gsap.set(macLidRef.current, { rotationX: -90 })
      tl.fromTo(modalRef.current, { opacity: 0, backdropFilter: 'blur(0px)' }, { opacity: 1, backdropFilter: 'blur(40px)', duration: 0.6, ease: 'power2.inOut' })
      tl.fromTo(macAssemblyRef.current, { z: -5000, rotationY: -1080, rotationX: 15, rotationZ: -10, scale: 0.05, opacity: 0 }, { z: 0, rotationY: 0, rotationX: 5, rotationZ: 0, scale: 1, opacity: 1, duration: 2.5, ease: 'power4.out' }, "-=0.4")
      tl.to(macLidRef.current, { rotationX: 0, duration: 1.5, ease: 'power3.inOut' }, "-=0.2")
      tl.fromTo('.modal-data-reveal', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', onComplete: () => { setIsBooting(false); setShowIframe(true) } }, "-=0.5")
    }
  }, [modalMounted])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (horizontalScrollRef.current && horizontalSectionRef.current) {
        const scrollWidth = horizontalScrollRef.current.scrollWidth
        const windowWidth = window.innerWidth
        gsap.to(horizontalScrollRef.current, {
          x: () => -(scrollWidth - windowWidth),
          ease: 'none',
          scrollTrigger: { trigger: horizontalSectionRef.current, start: 'top top', end: () => `+=${scrollWidth}`, scrub: 1.2, pin: true, anticipatePin: 1, invalidateOnRefresh: true },
        })
      }

      gsap.utils.toArray('.hud-reveal').forEach((item) => {
        gsap.fromTo(item, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: item, start: 'top 85%' } })
      })

      const interactives = document.querySelectorAll('.magnetic')
      interactives.forEach(el => {
        el.addEventListener('mouseenter', (e) => handleMagnetic(e, el))
        el.addEventListener('mouseleave', () => resetMagnetic(el))
      })
    }, containerRef)
    return () => ctx.revert()
  }, [handleMagnetic, resetMagnetic])

  useEffect(() => {
    if (isLoading) return
    const ctx = gsap.context(() => {
      const chars = gsap.utils.toArray('.hero-char')
      gsap.fromTo(chars, { opacity: 0, scale: 1.5, filter: 'blur(15px)', y: 50 }, { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0, duration: 1.8, stagger: 0.05, ease: 'expo.out' })
      gsap.fromTo('.hud-line', { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: 'expo.inOut', delay: 0.8 })
      gsap.fromTo('.hero-data', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.1, ease: 'power3.out', delay: 1.2 })
      gsap.fromTo('.nav-item', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 1.8 })
    }, containerRef)
    return () => ctx.revert()
  }, [isLoading])

  return (
    // CRITICAL FIX: The wrapper must have pointer-events-none so the mouse phases through empty space to grab the WebGL Canvas (Moon/ISS).
    <main ref={containerRef} className="relative w-full min-h-screen font-sans bg-transparent text-white overflow-hidden pointer-events-none">
      <CustomCursor />
      
      {/* 3D BACKGROUND ENGINE */}
      <FluidBackground />
      <Preloader />

      {/* TOP NAVIGATION HUD (With pointer-events-auto so you can click it) */}
      <header className="fixed top-0 left-0 w-full px-6 py-5 md:px-10 flex justify-between items-center z-40 bg-black/20 backdrop-blur-md border-b border-white/10 pointer-events-auto">
        <div className="nav-item flex items-center gap-4">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
          <div className="flex flex-col">
            <span className="font-display font-bold text-sm tracking-[0.25em] uppercase text-white">YASH BHARDWAJ</span>
            <span className="font-mono text-[9px] tracking-widest text-cyan-400/80 uppercase">SYS.ARCHITECT // v.6.0.0</span>
          </div>
        </div>
        <div className="nav-item flex items-center gap-6">
          <span className="font-mono text-[9px] tracking-widest text-white/50 uppercase hidden md:inline-block">LOC: 29.1492° N, 75.7217° E</span>
          <a 
            href="/resume.pdf" 
            download="Yash_Bhardwaj_Resume.pdf" 
            className="magnetic font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase border border-cyan-400/50 px-5 py-2.5 hover:bg-cyan-400 hover:text-black transition-all duration-300 rounded-sm cursor-none shadow-[0_0_15px_rgba(34,211,238,0.2)]"
          >
            Download_Resume.pdf
          </a>
        </div>
      </header>

      {/* 3D PROJECT MODAL (With pointer-events-auto) */}
      <div 
        ref={modalRef} 
        className={`fixed inset-0 z-[100] glass-modal flex flex-col items-center opacity-0 ${modalMounted ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {activeProject && (
          <button 
            onClick={closeProject} 
            className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] w-14 h-14 rounded-full border border-cyan-400/50 bg-[#010103]/90 backdrop-blur-md flex items-center justify-center magnetic hover:bg-cyan-400 hover:text-black transition-colors cursor-none shadow-[0_0_20px_rgba(34,211,238,0.3)] pointer-events-auto" 
            onMouseMove={(e) => handleMagnetic(e, e.currentTarget)} 
            onMouseLeave={(e) => resetMagnetic(e.currentTarget)}
          >
            <span className="font-mono text-xl pointer-events-none">✕</span>
          </button>
        )}

        <div ref={modalScrollAreaRef} className="w-full h-full overflow-y-auto overflow-x-hidden px-4 py-24 md:py-16 flex flex-col items-center">
          {activeProject && (
            <div className="w-full max-w-[1000px] flex flex-col items-center mt-10 md:mt-24 pb-32">
              
              <div className="mac-scene pointer-events-none">
                <div ref={macAssemblyRef} className="mac-assembly">
                  <div className="mac-base">
                    <div className="mac-keyboard" />
                    <div className="mac-trackpad" />
                    <div className="mac-lip" />
                  </div>
                  <div ref={macLidRef} className="mac-lid">
                    <div className="mac-back-face">
                      <svg className="mac-apple-logo" viewBox="0 0 384 512" fill="currentColor">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                      </svg>
                    </div>
                    <div className="mac-screen-face pointer-events-auto">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#000] border-x border-b border-[#1a1a1a] rounded-b-xl z-30 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
                          <div className="w-[2px] h-[2px] rounded-full bg-blue-500/80 shadow-[0_0_5px_#3b82f6]" />
                        </div>
                      </div>
                      {!showIframe && (
                        <div className="absolute inset-0 bg-[#050505] z-20 flex flex-col items-center justify-center">
                          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-1000 ease-out" style={{ width: isBooting ? '100%' : '0%' }} />
                          </div>
                        </div>
                      )}
                      {showIframe && (
                        <iframe src={activeProject.link} className="w-full h-full relative z-10" frameBorder="0" allowFullScreen sandbox="allow-scripts allow-same-origin" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full mt-32 md:mt-24 glass-panel hud-corners p-8 md:p-12 flex flex-col md:flex-row justify-between items-start gap-10 border border-cyan-400/30 modal-data-reveal opacity-0 pointer-events-auto">
                <div className="w-full md:w-2/3">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-mono text-xs tracking-[0.3em] text-cyan-400 uppercase">{activeProject.id}</span>
                    <div className="w-12 h-px bg-cyan-400/50" />
                    <span className="font-mono text-xs tracking-widest text-white/60 uppercase">{activeProject.subtitle}</span>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wider text-glow-cyan text-white">{activeProject.title}</h2>
                  <p className="font-mono text-sm text-white/70 max-w-2xl mt-6 leading-loose border-l-2 border-cyan-400/50 pl-6">{activeProject.description}</p>
                  
                  <div className="flex flex-wrap gap-8 mt-8 pt-6 border-t border-cyan-400/10">
                    {Object.entries(activeProject.metrics).map(([key, val]) => (
                      <div key={key} className="flex flex-col">
                        <span className="font-mono text-[9px] text-white/40 uppercase mb-1 tracking-widest">{key}</span>
                        <span className="font-mono text-lg text-cyan-400">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <h4 className="font-mono text-[10px] tracking-widest text-white/40 uppercase border-b border-cyan-400/20 pb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tech.map((t) => (
                      <span key={t} className="font-mono text-[10px] tracking-widest uppercase border border-cyan-400/30 px-4 py-2 bg-cyan-400/5 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors cursor-none">{t}</span>
                    ))}
                  </div>
                  <a href={activeProject.link} target="_blank" rel="noopener noreferrer" className="mt-8 font-mono text-xs tracking-widest text-center border border-cyan-400 text-cyan-400 py-4 hover:bg-cyan-400 hover:text-black transition-all cursor-none magnetic" data-strength="0.2">
                    INITIALIZE EXTERNAL LINK ↗
                  </a>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* z-[5] so the 3D scene objects (Moon/ISS) orbit OVER the hero text */}
      <div className="relative z-[5] w-full pointer-events-none">
        
        {/* HERO SECTION */}
        <section className="h-screen w-full flex flex-col justify-center items-center relative px-4 sm:px-6 overflow-hidden">
          <div className="text-center relative">
            <h1 className="font-display font-black text-[14vw] sm:text-[12vw] md:text-[9vw] leading-[0.9] tracking-tighter uppercase text-white drop-shadow-2xl">
              {'YASH'.split('').map((c, i) => (<span key={`y-${i}`} className="hero-char inline-block">{c}</span>))}
              <span className="hero-char inline-block">&nbsp;</span>
              {'BHARDWAJ'.split('').map((c, i) => (<span key={`b-${i}`} className="hero-char inline-block">{c}</span>))}
            </h1>
            <div className="flex items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 w-full">
              <div className="hud-line h-px w-12 sm:w-24 bg-white/40 transform origin-right" />
              <p className="hero-data font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.3em] sm:tracking-[0.5em] text-white uppercase whitespace-nowrap drop-shadow-md">Full-Stack AI Engineer</p>
              <div className="hud-line h-px w-12 sm:w-24 bg-white/40 transform origin-left" />
            </div>
          </div>

          <div className="absolute bottom-12 left-4 sm:left-6 md:left-12 flex flex-col gap-3 sm:gap-4">
            <div className="hero-data flex flex-col">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-white/50 uppercase">Core Capacity</span>
              <div className="flex gap-1 sm:gap-1.5 mt-2">
                {[...Array(6)].map((_, i) => (<div key={i} className="w-5 sm:w-8 h-1 bg-white shadow-[0_0_5px_#fff]" />))}
              </div>
            </div>
            <span className="hero-data font-mono text-[9px] sm:text-[10px] tracking-widest text-white uppercase">EDU: GGSIPU // B.TECH IT</span>
          </div>

          <div className="absolute bottom-12 right-4 sm:right-6 md:right-12 max-w-[200px] sm:max-w-[280px] hero-data text-right md:text-left hidden sm:block">
            <p className="font-mono text-[9px] sm:text-[10px] uppercase leading-loose text-white/80">
              <span className="text-white font-bold border-b border-white/50 pb-1 inline-block mb-2">INITIATIVE:</span><br/>
              Architecting high-performance agentic AI structures, scalable backends, and intense WebGL visual interfaces.
            </p>
          </div>
        </section>

        {/* HORIZONTAL PROJECTS ARCHIVE */}
        <section ref={horizontalSectionRef} className="h-screen w-full overflow-hidden flex items-center relative z-20 border-y border-cyan-400/10 bg-black/30 backdrop-blur-sm pointer-events-none">
          <div className="absolute top-16 sm:top-24 left-4 sm:left-6 md:left-12 z-30 flex items-center gap-3 sm:gap-6 hud-reveal">
            <span className="font-mono text-3xl sm:text-5xl text-cyan-400/30">01</span>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.5em] text-cyan-400 uppercase">Subroutine // Archive</span>
              <h2 className="font-display text-lg sm:text-2xl md:text-3xl tracking-widest uppercase text-white mt-1">Project Matrix</h2>
            </div>
          </div>

          <div ref={horizontalScrollRef} className="flex h-[65vh] sm:h-[75vh] items-center px-4 sm:px-6 md:px-24 gap-6 sm:gap-12 md:gap-24 w-max mt-16 pointer-events-auto">
            {PROJECTS_DATA.map((project, i) => (
              <div 
                key={project.id} 
                ref={(el) => { projectRefs.current[i] = el }} 
                onClick={() => openProject(project)} 
                className={`w-[80vw] sm:w-[85vw] md:w-[60vw] h-full flex flex-col justify-center relative group cursor-none ${i === PROJECTS_DATA.length - 1 ? 'mr-12 sm:mr-24' : ''}`} 
                onMouseMove={(e) => handleCardTilt(e, projectRefs.current[i])} 
                onMouseLeave={() => resetCardTilt(projectRefs.current[i])} 
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="w-full h-[60%] sm:h-[65%] glass-panel hud-corners relative flex flex-col p-4 sm:p-8 transition-all duration-500 overflow-hidden border-cyan-400/20 group-hover:border-cyan-400/60 shadow-lg">
                  <div className="absolute inset-0 bg-white/5 opacity-20 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
                  <div className="absolute top-0 right-0 p-3 sm:p-5 font-mono text-[9px] sm:text-[10px] text-cyan-400/40 tracking-widest pointer-events-none">SEQ_{project.id}</div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none" style={{ transform: 'translateZ(60px)' }}>
                    <div>
                      <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400 uppercase mb-2 sm:mb-3 block drop-shadow-md">{project.subtitle}</span>
                      <h3 className="font-display font-bold text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-white tracking-wider uppercase drop-shadow-2xl group-hover:text-cyan-400 transition-colors duration-500">{project.title}</h3>
                    </div>
                    
                    <div className="flex justify-between items-end">
                      <p className="font-mono text-[10px] sm:text-xs text-white/70 max-w-md leading-relaxed border-l-2 border-cyan-400/50 pl-3 sm:pl-5 hidden md:block">{project.description}</p>
                      <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 border border-cyan-400/60 text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300 hud-corners shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <span className="font-mono text-xl sm:text-2xl leading-none">+</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 sm:mt-8 flex flex-wrap gap-2 sm:gap-3 pointer-events-none">
                  {project.tech.map((t) => (
                    <span key={t} className="font-mono text-[8px] sm:text-[10px] tracking-widest text-cyan-400/70 uppercase border border-cyan-400/30 px-2 sm:px-4 py-1 sm:py-1.5 rounded-sm bg-cyan-400/10">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SYSTEM CAPABILITIES */}
        <section className="min-h-screen w-full px-4 sm:px-6 md:px-24 py-16 sm:py-32 relative z-20 bg-black/40 backdrop-blur-md">
          <div className="mb-12 sm:mb-24 hud-reveal flex items-center gap-3 sm:gap-6">
            <span className="font-mono text-3xl sm:text-5xl text-cyan-400/30">02</span>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.5em] text-cyan-400 uppercase">Subroutine // Diagnostics</span>
              <h2 className="font-display text-lg sm:text-2xl md:text-3xl tracking-widest uppercase text-white mt-1">System Specs</h2>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-32">
            <div className="w-full lg:w-1/2 flex flex-col gap-6 sm:gap-8 border-l border-cyan-400/30 pl-6 sm:pl-8 lg:pl-12 relative">
              <div className="hud-reveal relative pb-6 sm:pb-10 border-b border-cyan-400/10">
                <div className="absolute -left-[27px] sm:-left-[37px] lg:-left-[53px] top-1 w-3 h-3 sm:w-4 sm:h-4 bg-black border border-cyan-400 rotate-45 shadow-[0_0_10px_#22d3ee]" />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400 uppercase mb-2 sm:mb-3 block">Aug 2023 — Jul 2027</span>
                <h4 className="font-display text-base sm:text-xl tracking-wider uppercase text-white text-glow-cyan">B.Tech Information Technology</h4>
                <p className="font-mono text-[10px] sm:text-xs text-white/60 mt-3 sm:mt-4 leading-loose">Guru Gobind Singh Indraprastha University. Core focus on highly scalable algorithms, distributed systems, and applied AI architectures.</p>
              </div>
              
              <div className="hud-reveal relative pb-6 sm:pb-10 border-b border-cyan-400/10">
                <div className="absolute -left-[27px] sm:-left-[37px] lg:-left-[53px] top-1 w-3 h-3 sm:w-4 sm:h-4 bg-black border border-cyan-400 rotate-45 shadow-[0_0_10px_#22d3ee]" />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400 uppercase mb-2 sm:mb-3 block">2024 Protocol</span>
                <h4 className="font-display text-base sm:text-xl tracking-wider uppercase text-white text-glow-cyan">Smart India Hackathon</h4>
                <p className="font-mono text-[10px] sm:text-xs text-white/60 mt-3 sm:mt-4 leading-loose">Qualified the internal round of SIH 2024, competing and ranking among 150+ elite software development teams.</p>
              </div>
              
              <div className="hud-reveal relative pb-6 sm:pb-10 border-b border-cyan-400/10">
                <div className="absolute -left-[27px] sm:-left-[37px] lg:-left-[53px] top-1 w-3 h-3 sm:w-4 sm:h-4 bg-black border border-cyan-400 rotate-45 shadow-[0_0_10px_#22d3ee]" />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400 uppercase mb-2 sm:mb-3 block">2026 Protocol</span>
                <h4 className="font-display text-base sm:text-xl tracking-wider uppercase text-white text-glow-cyan">BPIT Achievement Portal</h4>
                <p className="font-mono text-[10px] sm:text-xs text-white/60 mt-3 sm:mt-4 leading-loose">Engineered the Student Achievement Management System for the IT department, digitizing academic tracking with zero latency.</p>
              </div>

              <div className="hud-reveal relative">
                <div className="absolute -left-[27px] sm:-left-[37px] lg:-left-[53px] top-1 w-3 h-3 sm:w-4 sm:h-4 bg-black border border-cyan-400 rotate-45 shadow-[0_0_10px_#22d3ee]" />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400 uppercase mb-2 sm:mb-3 block">Ongoing Protocol</span>
                <h4 className="font-display text-base sm:text-xl tracking-wider uppercase text-white text-glow-cyan">Algorithmic Problem Solving</h4>
                <p className="font-mono text-[10px] sm:text-xs text-white/60 mt-3 sm:mt-4 leading-loose">Rigorous practice and contest participation across LeetCode, Codeforces, and CodeChef to master core Data Structures and Algorithms.</p>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-10 flex flex-col gap-6 sm:gap-8 rounded-lg shadow-2xl">
                <div className="flex justify-between items-center border-b border-white/20 pb-4 sm:pb-5">
                  <h4 className="font-mono text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] text-white/80 uppercase">Technical Arsenal</h4>
                  <span className="font-mono text-[9px] sm:text-[10px] text-cyan-400">[SYS_OPTIMIZED]</span>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {SKILLS_MATRIX.map((skill) => (
                    <div key={skill} className="font-mono text-[10px] sm:text-[11px] tracking-widest text-white border border-white/20 bg-white/5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-sm">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEVELOPER COMMUNICATION / TERMINAL FOOTER */}
        <footer className="min-h-[100vh] w-full flex flex-col items-center justify-center relative z-20 border-t border-cyan-400/30 bg-gradient-to-t from-cyan-400/10 to-[#010103] overflow-hidden py-32 px-6">
          <div className="absolute inset-0 bg-white/5 opacity-10" />
          
          <span className="font-mono text-xs tracking-[0.6em] text-cyan-400 uppercase mb-6 z-10 animate-pulse drop-shadow-md">03 // Initialize Handshake</span>
          <h2 className="hud-reveal font-display font-black text-4xl md:text-6xl tracking-tighter uppercase text-white text-glow-cyan z-10 text-center leading-none">
            Developer Contact
          </h2>

          <div className="w-full z-10 hud-reveal">
            <DeveloperTerminal />
          </div>
        </footer>
      </div>
    </main>
  )
}