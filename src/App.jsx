import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, Twitter, Linkedin, ArrowUpRight, Mail, BookOpen, Wifi, 
  Cpu, Command, Zap, Terminal, Layers, Globe, Code, Layout,
  Send, Loader, CheckCircle, GraduationCap, Menu, X, 
  User, Heart 
} from 'lucide-react';

// --- Utility: Optimized Scroll Animation ---
const ScrollReveal = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.21,1.02,0.73,1)] transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};

// --- Components ---

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = ['About','Projects', 'Experience', 'Education', 'Tools', 'Skills', 'Contact'];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md border-white/10' 
          : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <button 
            onClick={scrollToTop} 
            className="flex items-center gap-3 font-bold text-xl tracking-tight text-white hover:opacity-80 transition-opacity cursor-pointer group z-50 relative"
          >
            <svg 
              width="24" height="24" viewBox="0 0 75 65" fill="white" xmlns="http://www.w3.org/2000/svg"
              className="group-hover:-translate-y-0.5 transition-transform duration-300"
            >
              <path d="M37.59.25l36.95 64H.64l36.95-64z" />
            </svg>
            <span>Kaushik</span>
          </button>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            {navLinks.map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="hover:text-white transition-colors duration-200 hover:scale-105 transform"
              >
                  {item}
              </a>
            ))}
          </div>

          {/* Desktop Hire Me Button */}
          <div className="hidden md:block">
            <a 
              href="https://www.linkedin.com/in/kaushik-funde-239925373/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold           hover:bg-zinc-200 transition-all active:scale-95 duration-200 inline-block"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
              className="md:hidden text-white z-50 relative p-2 -mr-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
          >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col justify-center items-center p-6 animate-in fade-in duration-200 touch-none">
            {/* Close button */}
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-6 p-3 text-white hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col gap-8 text-center w-full max-w-sm">
                {/* Navigation Links */}
                {navLinks.map((item) => (
                    <a 
                    key={item} 
                    href={`#${item.toLowerCase()}`} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-3xl font-bold text-zinc-400 hover:text-white transition-colors"
                    >
                    {item}
                    </a>
                ))}
                
                {/* Divider Line */}
                <div className="h-px bg-white/10 w-full my-4" />
                
                {/* SINGLE Hire Me Button at the bottom */}
                <a 
                  href="https://www.linkedin.com/in/your-profile-url/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)} 
                  className="bg-white text-black px-8 py-4 rounded-full text-xl font-bold hover:bg-zinc-200 transition-all w-full text-center block"
                >
                  Hire Me
                </a>
            </div>
        </div>
      )}
      
    </>
  );
};

const Hero = () => (
  <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
    <div 
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(29, 78, 216, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 30%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)
        `,
        filter: 'blur(60px)',
      }}
    />

    <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex-1 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-zinc-300 mb-6 animate-fade-in-up hover:border-white/30 transition-colors cursor-default">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Available for new projects
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 animate-fade-in-up delay-100 drop-shadow-xl leading-[1.1] break-words">
          Kaushik Funde.
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mb-10 leading-relaxed animate-fade-in-up delay-200 drop-shadow-lg mx-auto md:mx-0">
          Bridging the gap between silicon and software.
          I engineer robust embedded systems and scalable web applications.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up delay-300 w-full">
          <a href="#projects" className="h-12 px-8 rounded-full bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 duration-200 w-full sm:w-auto hover:-translate-y-1">
            View Work <ArrowUpRight size={18} />
          </a>
          <a href="https://github.com/Kaushikfunde" target="_blank" rel="noreferrer" className="h-12 px-8 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white font-medium flex items-center justify-center gap-2 hover:bg-black hover:border-white transition-all active:scale-95 duration-200 w-full sm:w-auto hover:-translate-y-1">
            <Github size={18} /> GitHub
          </a>
        </div>
      </div>

      <div className="relative group animate-fade-in-up delay-200 flex-shrink-0 mt-12 md:mt-0">
        {/*<div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl mx-auto">
          <img 
            src="image02.jpg" 
            alt="Kaushik Funde" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-transform duration-700 ease-out scale-105 group-hover:scale-100"
          />
        </div>*/}
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="py-20 px-6 bg-black border-t border-white/5 relative overflow-hidden">
    {/* Decorative Background Element */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
    
    <div className="max-w-6xl mx-auto relative z-10">
      <ScrollReveal>
        <div className="flex items-center gap-4 mb-12">
          <div className="p-2 bg-zinc-900 rounded-lg border border-white/10">
            <User size={24} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">About Me</h2>
        </div>
      </ScrollReveal>

      <div className="grid md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Bio */}
        <div className="md:col-span-7 space-y-6">
          <ScrollReveal delay={100}>
            <p className="text-zinc-400 text-lg leading-relaxed">
              I'm a <span className="text-white font-medium">First Year Electronics Engineering student</span> with a deep passion for the intersection of hardware and software. 
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed mt-4">
              My journey began with dismantling household electronics to see how they worked, which naturally evolved into designing my own circuits and eventually writing the software that brings them to life.
            </p>
            <p className="text-zinc-400 text-lg leading-relaxed mt-4">
              Unlike many who specialize in just one end of the stack, I thrive in the middle—where code meets copper. Whether it's optimizing a React frontend for speed or squeezing the last byte of memory out of a microcontroller, I love solving complex engineering problems.
            </p>
          </ScrollReveal>
        </div>

        {/* Right Column: Key Focus Cards */}
        <div className="md:col-span-5 flex flex-col gap-4">
            <ScrollReveal delay={200}>
            <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Cpu className="text-blue-400" size={20} />
                <h3 className="text-white font-bold">Hardware Enthusiast</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Obsessed with embedded systems, PCB design, and making dumb devices smart via IoT.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={300}>
            <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Layout className="text-green-400" size={20} />
                <h3 className="text-white font-bold">Full Stack Developer</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Building responsive, accessible web applications with modern frameworks like Next.js and React.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="text-red-400" size={20} />
                <h3 className="text-white font-bold">Open Source</h3>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Believer in community-driven development. I started contribute to and maintain open source projects.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  </section>
);

const ProjectCard = ({ title, desc, tags, icon: Icon, size = "small" }) => (
  <div className={`group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] p-6 md:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 hover:border-white/20 ${
    size === "large" ? "md:col-span-2" : "md:col-span-1"
  }`}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-green-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    
    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
      <ArrowUpRight className="text-white" size={20} />
    </div>

    <div className="h-full flex flex-col justify-between relative z-10">
      <div className="mb-6">
        <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300">
          <Icon size={20} className="text-zinc-400 group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-white transition-colors">{title}</h3>
        <p className="text-zinc-400 leading-relaxed text-sm">{desc}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-auto">
        {tags.map((tag) => (
          <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-white/5 text-zinc-400 border border-white/5 group-hover:border-white/20 group-hover:bg-white/10 transition-all">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const Projects = () => (
  <section id="projects" className="py-20 md:py-32 px-6 border-t border-white/5 bg-black">
    <div className="max-w-6xl mx-auto">
      <ScrollReveal>
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 inline-block">Selected Work</h2>
          <p className="text-zinc-400">A showcase of hardware and software engineering.</p>
        </div>
      </ScrollReveal>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ScrollReveal delay={100}><ProjectCard title="Smart Home IoT Hub" desc="A centralized dashboard for home automation using MQTT and ESP32 nodes." tags={['IoT', 'React', 'MQTT', 'C++']} icon={Wifi} size="large" /></ScrollReveal>
        <ScrollReveal delay={200}><ProjectCard title="Drone Flight Controller" desc="Custom firmware for STM32 microcontrollers implementing PID stabilization." tags={['Embedded C', 'RTOS', 'STM32']} icon={Cpu} /></ScrollReveal>
        <ScrollReveal delay={300}><ProjectCard title="E-Commerce Engine" desc="Headless Next.js commerce platform with sub-second load times." tags={['Next.js', 'Stripe', 'Redis']} icon={Command} /></ScrollReveal>
        <ScrollReveal delay={400}><ProjectCard title="Energy Monitor" desc="Real-time power consumption tracking utilizing non-invasive current sensors." tags={['Hardware', 'Python', 'InfluxDB']} icon={Zap} size="large" /></ScrollReveal>
      </div>
    </div>
  </section>
);

const Experience = () => (
  <section id="experience" className="py-20 md:py-32 px-6 border-t border-white/5 bg-black">
    <div className="max-w-3xl mx-auto">
      <ScrollReveal>
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Work History</h2>
      </ScrollReveal>
      
      <div className="relative border-l border-zinc-800 ml-3 space-y-16">
        {[
          { 
            role: "Independent IoT Engineer", // Changed from 'Intern' to show ownership
            company: "Self-Initiated Projects", 
            period: "Present", 
            desc: "Architecting and building end-to-end IoT solutions using ESP32 microcontrollers. Designing custom PCBs, writing optimized C++ firmware, and implementing real-time data communication (MQTT/HTTP) for smart home automation systems." 
          },
        ].map((job, i) => (
          <ScrollReveal key={i} delay={i * 100}>
            <div className="relative pl-8 md:pl-12 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-black border border-zinc-600 ring-4 ring-black group-hover:border-white group-hover:scale-125 transition-all duration-300" />
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-xl font-bold text-zinc-100">{job.role}</h3>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-white/5 mt-1 sm:mt-0 w-fit">{job.period}</span>
              </div>
              
              {/* Company Name */}
              <p className="text-blue-400 text-sm mb-4 font-medium">{job.company}</p>
              
              {/* Description */}
              <p className="text-zinc-400 leading-relaxed max-w-xl text-sm md:text-base">{job.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

const Education = () => (
  <section id="education" className="py-20 px-6 border-t border-white/5 bg-black">
    <div className="max-w-3xl mx-auto">
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-12">
            <div className="p-2 bg-zinc-900 rounded-lg border border-white/10">
                <GraduationCap size={24} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Education</h2>
        </div>
      </ScrollReveal>

      <div className="relative border-l border-zinc-800 ml-3 space-y-12">
        <ScrollReveal delay={100}>
            <div className="relative pl-8 md:pl-12 group">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-black border border-zinc-600 ring-4 ring-black group-hover:border-blue-500 group-hover:scale-125 transition-all duration-300" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-white">Bachelor of Technology</h3>
                        <p className="text-blue-400 font-medium text-sm mt-1">Electronics Engineering</p>
                    </div>
                    <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mt-2 sm:mt-0 w-fit">2025 - Present</span>
                </div>
                <p className="text-zinc-400 text-sm mt-2 max-w-xl">Currently pursuing 1st Year. Focusing on core programming and hardware fundamentals.</p>
            </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
            <div className="relative pl-8 md:pl-12 group">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-black border border-zinc-600 ring-4 ring-black group-hover:border-white group-hover:scale-125 transition-all duration-300" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-lg font-bold text-zinc-200">Higher Secondary (12th Grade)</h3>
                    <span className="text-zinc-500 text-xs font-mono bg-zinc-900 px-2 py-1 rounded border border-white/5 mt-2 sm:mt-0 w-fit">2022 - 2024</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-zinc-400 text-sm">Percentage:</span>
                    <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded text-sm">75.67%</span>
                </div>
            </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
            <div className="relative pl-8 md:pl-12 group">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-black border border-zinc-600 ring-4 ring-black group-hover:border-green-500 group-hover:scale-125 transition-all duration-300" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-lg font-bold text-zinc-200">Secondary School (10th Grade)</h3>
                    <span className="text-zinc-500 text-xs font-mono bg-zinc-900 px-2 py-1 rounded border border-white/5 mt-2 sm:mt-0 w-fit">2021 - 2022</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-zinc-400 text-sm">Percentage:</span>
                    <span className="text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded text-sm">91%</span>
                </div>
            </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

// --- Favorite Tools Section (FIXED URLS to resolve 404 Errors) ---
const FavoriteTools = () => {
  const tools = [
    { name: "VS Code", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name: "Git", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "Notion", url: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" }, 
    { name: "Docker", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "Vite", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
    { name: "MATLAB", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" },
    { name: "Arduino", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" },
    { name: "KiCad", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/KiCad-Logo.svg/1200px-KiCad-Logo.svg.png" }, 
  ];

  return (
    <section id="tools" className="py-24 px-6 border-t border-white/5 bg-black">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 bg-zinc-900 rounded-lg border border-white/10">
              <Terminal size={24} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Favorite Tools</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tools.map((tool, index) => (
            <ScrollReveal key={tool.name} delay={index * 50}>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-zinc-900/20 border border-white/5 hover:border-white/10 hover:bg-zinc-900/40 transition-all duration-300 hover:-translate-y-1 cursor-default">
                <div className="relative w-10 h-10 flex items-center justify-center bg-black rounded-lg border border-white/10 group-hover:border-white/20 transition-colors flex-shrink-0 p-2">
                  <img 
                    src={tool.url} 
                    alt={tool.name}
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                <span className="text-zinc-400 font-medium text-sm group-hover:text-white transition-colors">
                  {tool.name}
                </span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillBadge = ({ icon: Icon, name }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#0A0A0A] border border-white/5 hover:bg-zinc-900 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-default group">
    <Icon size={18} className="text-zinc-500 group-hover:text-white transition-colors duration-300 flex-shrink-0" />
    <span className="text-zinc-400 text-sm font-medium transition-colors duration-300 group-hover:text-white">{name}</span>
  </div>
);

const Skills = () => (
  <section id="skills" className="py-32 px-6 border-t border-white/5 bg-black relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
    
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <ScrollReveal>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tech Stack</h2>
            <p className="text-zinc-400 max-w-md">The modern toolbelt for building scalable applications and embedded systems.</p>
          </div>
        </ScrollReveal>
        <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-zinc-800 to-transparent"></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { i: Code, n: "C / C++" }, { i: Cpu, n: "Embedded Systems" }, 
          { i: Layout, n: "React / Next.js" }, { i: Layers, n: "PCB Design" },
          { i: Globe, n: "IoT / MQTT" }, { i: Terminal, n: "Python" },
          { i: Zap, n: "Rust" }, { i: Command, n: "Linux / RTOS" }
        ].map((s, index) => (
          <ScrollReveal key={s.n} delay={index * 50}>
            <SkillBadge icon={s.i} name={s.n} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

const Contact = () => {
  const [formState, setFormState] = useState('idle');
  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('loading');
    
    const formData = new FormData(e.target);
    
    // Replace with your actual Web3Forms Access Key
    formData.append("access_key", "eafbfada-19e5-4fb4-93aa-6f8a7859e8a8"); 

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setFormState('success');
      } else {
        console.error("Error", data);
        setResult(data.message);
        setFormState('idle'); // Go back so they can try again
      }
    } catch (error) {
      console.error("Error", error);
      setResult("Something went wrong.");
      setFormState('idle');
    }
  };

  return (
    <section id="contact" className="py-32 px-6 border-t border-white/5 bg-black text-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-white/5 to-transparent blur-[100px] rounded-full pointer-events-none" />
      
      <ScrollReveal>
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-600">
            Ready to ship?
          </h2>
          
          {formState === 'success' ? (
              <div className="p-8 bg-zinc-900/50 border border-white/10 rounded-2xl animate-fade-in-up">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Received.</h3>
                <p className="text-zinc-400">I'll get back to you within 24 hours.</p>
                <button onClick={() => setFormState('idle')} className="mt-6 text-sm text-zinc-500 underline hover:text-white">Send another</button>
              </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left bg-zinc-900/30 p-6 md:p-8 rounded-2xl border border-white/5 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-zinc-900/40">
                <p className="text-lg text-zinc-400 mb-6 text-center">
                    Currently available for freelance work and open source collaborations.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-500 uppercase ml-1">Name</label>
                        <input name="name" required type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="John Doe" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-zinc-500 uppercase ml-1">Email</label>
                        <input name="email" required type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="john@example.com" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 uppercase ml-1">Message</label>
                    <textarea name="message" required rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="Tell me about your project..." />
                </div>
                
                <button disabled={formState === 'loading'} className="w-full py-4 rounded-xl font-bold text-black bg-white hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                    {formState === 'loading' ? <Loader className="animate-spin" /> : <><Send size={18} /> Send Message</>}
                </button>
                
                {/* Error Message Display */}
                {result && <p className="text-red-500 text-sm text-center mt-2">{result}</p>}
            </form>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/10 bg-black">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5 w-fit hover:border-white/20 transition-colors">
            <div className="flex gap-1 items-end h-4">
              <span className="w-1 h-2 bg-green-500 animate-[music-bar_1s_ease-in-out_infinite]" />
              <span className="w-1 h-3 bg-green-500 animate-[music-bar_1.2s_ease-in-out_infinite_0.1s]" />
              <span className="w-1 h-1 bg-green-500 animate-[music-bar_0.8s_ease-in-out_infinite_0.2s]" />
            </div>
            <div className="text-xs">
              <p className="text-zinc-500 font-medium uppercase tracking-wider text-[10px]">Now Listening</p>
              <p className="text-zinc-300 font-medium">Happy Nation - 1992</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
              <BookOpen size={14} />
              <span>Learning: FPGA & Verilog</span>
          </div>
        </div>

        {/* --- UPDATED SOCIAL LINKS SECTION --- */}
        <div className="flex gap-6">
          {/* 1. Twitter / X Link */}
          <a 
            href="https://x.com/KaushikFunde" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-blue transition-all hover:scale-110 hover:text-blue-400"
            aria-label="Twitter"
          >
            <Twitter size={20} />
          </a>

          {/* 2. LinkedIn Link */}
          <a 
            href="https://www.linkedin.com/in/kaushik-funde-239925373/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-blue transition-all hover:scale-110 hover:text-blue-600"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>

          {/* 3. GitHub Link */}
          <a 
            href="https://github.com/Kaushikfunde" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-white transition-all hover:scale-110"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>

          {/* 4. Email Link (mailto:) */}
          <a 
            href="mailto:kaushikfunde401@gmail.com" 
            className="text-zinc-600 hover:text-white transition-all hover:scale-110"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
        {/* ------------------------------------ */}

      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>All systems normal</span>
        </div>
        <p className="text-zinc-600 text-xs">© 2024 Kaushik Funde. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 overflow-x-hidden w-full">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body { 
          font-family: 'Inter', sans-serif; 
          background-color: #000;
          overflow-x: hidden; 
          width: 100%;
        }
        
        html { scroll-behavior: smooth; overflow-x: hidden; }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes music-bar {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }

        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          mask-image: linear-gradient(to bottom, black 10%, transparent 100%);
        }
      `}</style>

      <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
      
      <div className="relative z-10 w-full max-w-[100vw] overflow-hidden">
        <Nav />
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Education />
        <FavoriteTools />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}