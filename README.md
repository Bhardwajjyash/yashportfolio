# ◈ SYS.ARCHITECT — 3D Holographic Portfolio

> **An immersive WebGL portfolio engineered as a digital system interface.**
> Built with **Next.js, React Three Fiber, Three.js, GSAP, and Tailwind CSS**.

<p align="center">
  <a href="https://bhardwajjyash.vercel.app/">
    <img src="https://img.shields.io/badge/◉_LIVE_PORTFOLIO-00F0FF?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <a href="https://github.com/bhardwajjyash/yashportfolio">
    <img src="https://img.shields.io/badge/SOURCE_CODE-111111?style=for-the-badge&logo=github&logoColor=white" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NEXT.JS-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/THREE.JS-000000?style=flat-square&logo=three.js&logoColor=white" />
  <img src="https://img.shields.io/badge/R3F-202020?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white" />
  <img src="https://img.shields.io/badge/TAILWIND-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" />
</p>

---

## `01 // SYSTEM OVERVIEW`

**SYS.ARCHITECT** is a 3D interactive portfolio designed around a futuristic **system-architecture / holographic interface**.

Instead of presenting projects through conventional cards and sections, the portfolio treats the entire website as an interactive digital environment — combining **real-time planetary rendering, spatial UI, telemetry, cinematic transitions, and a virtual MacBook workspace**.

```text
┌──────────────────────────────────────────────────────────────┐
│                    SYS.ARCHITECT v1.0                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   EARTH ENGINE        →   Real-time planetary visualization │
│   TELEMETRY           →   Geospatial target tracking       │
│   HOLOGRAPHIC UI      →   Interactive system interface     │
│   VIRTUAL MAC         →   3D project execution environment │
│   MOTION ENGINE       →   GSAP + Lenis                     │
│   WEBGL CORE          →   Three.js + React Three Fiber     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## `02 // CORE ARCHITECTURE`

### ◉ Real-Time 3D Earth

A custom WebGL Earth rendered using **Three.js + GLSL shaders**.

* Ultra-high-resolution planetary textures
* Custom atmospheric and surface shaders
* Dynamic day/night visualization
* Indian Standard Time synchronized lighting
* Real-time solar positioning
* Cinematic planetary presentation

The day/night system is calculated mathematically rather than relying on an external time API.

---

### ◉ Geospatial Target Lock

The planetary camera is mathematically oriented toward:

```text
TARGET
LATITUDE   → 29.1492° N
LONGITUDE  → 75.7217° E

LOCATION
Hisar
Haryana
India
```

A dedicated telemetry pulse identifies the target location while the night hemisphere reveals illuminated urban regions.

---

### ◉ Virtual macOS Environment

Projects are presented through a **fully interactive 3D MacBook interface**.

```text
                    ┌─────────────────────┐
                    │      PROJECTS       │
                    │                     │
                    │   ┌─────────────┐   │
                    │   │   WEB APP   │   │
                    │   │             │   │
                    │   │    LIVE     │   │
                    │   │   SYSTEM    │   │
                    │   └─────────────┘   │
                    └─────────────────────┘
                             │
                             ▼
                       PROJECT ENGINE
```

The interface transforms project exploration into an interactive desktop-like experience rather than a traditional portfolio grid.

---

### ◉ Hybrid Iframe Architecture

The portfolio dynamically determines how external projects should be displayed.

```text
                    PROJECT REQUEST
                          │
                          ▼
                 ┌──────────────────┐
                 │   LOAD TARGET     │
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │ IFRAME AVAILABLE? │
                 └──────┬─────┬─────┘
                        │     │
                      YES      NO
                        │     │
                        ▼     ▼
                  WEB PREVIEW  SECURE
                              UPLINK
```

Normal web applications are loaded directly inside the virtual environment.

Restricted platforms such as GitHub, where embedding may be blocked by security headers, are automatically routed to a custom **Secure Uplink** fallback interface.

---

### ◉ Cinematic WebGL

The visual system combines multiple rendering techniques:

* WebGL rendering
* Custom GLSL shaders
* Bloom
* Vignette
* Dynamic lighting
* Atmospheric effects
* Depth-based composition
* GPU-accelerated animations

The objective is to create a cinematic interface while keeping the rendering pipeline optimized for smooth interaction.

---

### ◉ Motion Engine

The interface uses **GSAP** and **Lenis** to control motion and scrolling.

```text
USER INPUT
    │
    ▼
LENIS SCROLL
    │
    ▼
GSAP TIMELINE
    │
    ├── UI TRANSITIONS
    ├── CAMERA MOTION
    ├── MODAL ANIMATION
    └── PROJECT INTERACTION
```

Background physics and animations can dynamically pause when modal interfaces become active, reducing unnecessary GPU work.

---

# `03 // TECH STACK`

| Layer           | Technology                                   |
| --------------- | -------------------------------------------- |
| Framework       | **Next.js**                                  |
| Frontend        | **React**                                    |
| 3D Engine       | **Three.js**                                 |
| WebGL Framework | **React Three Fiber**                        |
| 3D Utilities    | **Drei**                                     |
| Shaders         | **GLSL**                                     |
| Styling         | **Tailwind CSS**                             |
| Animation       | **GSAP**                                     |
| Smooth Scroll   | **Lenis**                                    |
| Deployment      | **Vercel**                                   |
| Assets          | **Custom SVG + Ultra-HD Planetary Textures** |

---

# `04 // PROJECT ECOSYSTEM`

The portfolio acts as a central interface for a collection of full-stack, AI, and experimental engineering projects.

### `BhejaFry`

**Real-time multiplayer trivia engine**

Real-time multiplayer experience powered by WebSockets and interactive game-state synchronization.

→ https://bhejafry.fun

---

### `Yash.Album`

**MERN-based photography platform**

A full-stack social photography platform featuring authentication, profiles, posts, image processing, likes, chat, online presence, and cloud media storage.

→ https://yash-album.onrender.com/

---

### `Foggy Vehicle Detection`

**Computer Vision Pipeline**

A computer-vision project focused on vehicle detection under foggy conditions with image dehazing and object-detection workflows.

---

### `Plant Disease CNN`

**Deep Learning Classification**

A TensorFlow/Keras convolutional neural network trained for multi-class plant disease recognition.

---

### `SAMS Portal`

**Department Management System**

A role-based digital platform designed for academic workflow and departmental operations.

---

### `Produtrix`

**Productivity Analytics**

A data-driven productivity and calendar analytics platform integrating Google OAuth and scheduling workflows.

---

# `05 // LOCAL INITIALIZATION`

Clone the repository:

```bash
git clone https://github.com/bhardwajjyash/yashportfolio.git
```

Navigate into the project:

```bash
cd yashportfolio
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# `06 // SYSTEM REQUIREMENTS`

```text
Node.js    → 18+
npm        → Latest stable version
Browser    → WebGL capable
GPU        → Recommended for optimal 3D experience
```

For the intended experience, use a modern Chromium-based browser with hardware acceleration enabled.

---

# `07 // DESIGN PHILOSOPHY`

The interface follows a simple principle:

> **Don't make the portfolio look like a portfolio.**

Every major interaction is treated as part of a digital operating environment.

```text
TRADITIONAL PORTFOLIO
        │
        ├── Hero
        ├── About
        ├── Projects
        └── Contact

              ↓

SYS.ARCHITECT
        │
        ├── GLOBAL SYSTEM
        ├── PLANETARY TELEMETRY
        ├── PROJECT NODES
        ├── VIRTUAL WORKSPACE
        └── SECURE UPLINK
```

The goal is to merge **engineering + visual design + interaction** into one cohesive experience.

---

# `08 // PERFORMANCE`

The experience is designed around GPU-conscious rendering and selective animation.

Key optimization strategies include:

* Controlled WebGL rendering
* Conditional animation loops
* Dynamic background physics
* Efficient asset loading
* GPU-accelerated transforms
* Modal-based animation suspension
* Optimized external project loading

---

# `09 // DEPLOYMENT`

The production build is deployed through **Vercel's global infrastructure**.

### Live System

**https://bhardwajjyash.vercel.app/**

### Source

**https://github.com/bhardwajjyash/yashportfolio**

---

# `10 // ARCHITECT`

**Yash Bhardwaj**

Full-Stack • AI • WebGL • Creative Engineering

```text
┌──────────────────────────────────────┐
│                                      │
│       Y A S H   B H A R D W A J     │
│                                      │
│       FULL-STACK AI ENGINEER         │
│                                      │
│       WEB  /  AI  /  3D  /  ML      │
│                                      │
└──────────────────────────────────────┘
```

### Connect

**GitHub**
https://github.com/bhardwajjyash

**Portfolio**
https://bhardwajjyash.vercel.app/

---

<p align="center">

`SYSTEM STATUS: ONLINE`

**◉ ENGINEERED WITH CODE + CURIOSITY**

</p>
