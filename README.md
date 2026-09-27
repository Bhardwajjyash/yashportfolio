🌐  Portfolio // SYS.ARCHITECT
Live Deployment: bhardwajjyash.vercel.app

An immersive, high-performance 3D portfolio engineered with Next.js, React Three Fiber, and GSAP. Designed with a futuristic "System Architect" aesthetic, this project features a fully interactive 8K WebGL Earth, custom GLSL shaders, and a virtual macOS environment for browsing live project deployments.

⚡ Core Features
Real-Time 3D Earth (8K Resolution): Utilizes custom GLSL shaders to render a cinematic Earth. Features an accurate, math-driven day/night cycle strictly synchronized to Indian Standard Time (IST) without relying on external APIs.

Geospatial Locking: The camera is mathematically locked to Hisar, Haryana, indicated by a subtle, glowing tracking pulse. The night side renders true pitch-black oceans with vibrant, glowing city lights.

Virtual MacBook UI: Projects are loaded inside a fully 3D-rendered virtual MacBook.

Hybrid Iframe System: Features a custom routing logic that seamlessly loads standard websites inside the virtual MacBook, while automatically detecting X-Frame-Options restricted domains (like GitHub) and serving a sleek "Secure Uplink" terminal UI fallback.

Cinematic Post-Processing: Implements optimized Three.js Bloom and Vignette passes for a neon cyberpunk aesthetic without compromising frame rates.

Fluid Animation System: Powered by GSAP and Lenis for buttery-smooth global scroll control, allowing the background to dynamically freeze when modal UI elements are active.

🛠️ Technical Stack
Framework: Next.js (React)

3D Engine: Three.js, React Three Fiber (R3F), Drei

Styling: Tailwind CSS

Animation: GSAP (GreenSock), Lenis Scroll

Deployment: Vercel (Edge Network optimized)

Assets: Custom SVGs, 8K planetary texture maps

🚀 Local Development
To run this project locally, ensure you have Node.js installed, then execute the following commands:

Bash
# 1. Clone the repository
git clone https://github.com/bhardwajjyash/yashportfolio.git

# 2. Navigate into the directory
cd yashportfolio

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
Open http://localhost:3000 with your browser to see the result.

📂 Project Ecosystem
This portfolio serves as the central hub for my full-stack engineering and machine learning architecture, including:

BhejaFry: Real-time WebSockets trivia engine.

Yash.Album: Redux/MERN image matrix for photographers.

Foggy Vehicle Detect: Custom OpenCV image dehazing.

Plant Disease CNN: TensorFlow/Keras neural network.

SAMS Portal: Role-based system architecture for BPIT.

Produtrix: Data-driven calendar analytics via Google OAuth2.

Engineered by Yash Bhardwaj • Full-Stack AI Engineer
