import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { 
  Github, Twitter, Linkedin, ArrowUpRight, Mail, BookOpen, Download,
  Cpu, CircuitBoard, Command, Zap, Terminal, Layers, Globe, Code,
  Send, Loader, CheckCircle, GraduationCap, Menu, X, 
  User, Heart, MapPin
} from 'lucide-react';
import useSmoothScroll from './hooks/useSmoothScroll';
import Manifesto from './components/Manifesto';
import ScrollProgress from './components/ScrollProgress';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(CSSPlugin);

if (typeof window !== 'undefined') {
  window.__gsap = gsap;
  window.__ScrollTrigger = ScrollTrigger;
}

// --- Utility: GSAP-powered scroll reveal ---
const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(element, { opacity: 1, y: 0 });
      return undefined;
    }

    const animation = gsap.fromTo(
      element,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay: delay / 1000,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </div>
  );
};

// --- Utility: Scroll-triggered word-by-word reveal (CSS + IntersectionObserver, no GSAP ticker dependency) ---
const ScrollWordReveal = ({ children, className = "" }) => {
  const ref = useRef(null);
  const revealedRef = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(element, { opacity: 1 });
      gsap.set(element.querySelectorAll('.word-char'), { opacity: 1, y: 0 });
      return undefined;
    }

    const words = element.textContent.trim().split(/\s+/);
    element.innerHTML = words.map((w) => `<span class="word-char">${w}</span>`).join(' ');

    const doReveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      element.classList.add('revealed-words');
    };

    const checkVisibility = () => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
        doReveal();
      }
    };

    // Check on mount
    checkVisibility();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) doReveal();
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(element);

    window.addEventListener('scroll', checkVisibility);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkVisibility);
    };
  }, []);

  return (
    <h2 ref={ref} className={className} style={{ willChange: 'transform, opacity' }}>
      {children}
    </h2>
  );
};

// --- Components ---

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeMenu();
  };

  // Prevent scrolling only while the menu is open.
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();

    return () => {
      document.body.style.overflow = '';
      window.__lenis?.start();
    };
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
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-zinc-400">
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
          <div className="hidden lg:block">
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
              className="lg:hidden text-white z-50 relative p-2 -mr-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={isMenuOpen ? closeMenu : openMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
          >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-black p-6 py-24 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
          {/* Close button */}
          <button 
            onClick={closeMenu}
            aria-label="Close menu"
            className="fixed top-5 right-6 p-3 text-white hover:bg-zinc-800 rounded-full transition-colors"
          >
            <X size={32} />
          </button>

          <div className="menu-inner mx-auto flex w-full max-w-sm flex-col items-center gap-5 text-center sm:gap-8">
              {/* Navigation Links */}
              {navLinks.map((item) => (
                  <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={closeMenu}
                  className="text-2xl sm:text-3xl font-bold text-zinc-400 hover:text-white transition-colors"
                  >
                  {item}
                  </a>
              ))}
              
              {/* Divider Line */}
              <div className="h-px bg-white/10 w-full my-2 sm:my-4" />
              
              {/* SINGLE Hire Me Button at the bottom */}
              <a 
                href="https://www.linkedin.com/in/kaushik-funde-239925373/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={closeMenu} 
                className="bg-white text-black px-8 py-4 rounded-full text-xl font-bold hover:bg-zinc-200 transition-all w-full text-center block"
              >
                Hire Me
              </a>
          </div>
      </div>
      
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

    <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center gap-12 lg:items-start lg:text-left">
      <div className="text-center md:text-left">
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-zinc-300 mb-6 hover:border-white/30 transition-colors cursor-default">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Available for new projects
        </div>
        
        <h1 className="hero-heading text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter text-white mb-6 drop-shadow-xl leading-[1.1] break-words">
          Kaushik Funde.
        </h1>
        
        <p className="hero-subhead text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl mb-10 leading-relaxed drop-shadow-lg mx-auto md:mx-0">
          Electronics engineering student in Nagpur.
          <br />
          I design embedded systems, custom PCBs, and full-stack web applications.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start w-full">
          <a href="#projects" className="hero-btn h-12 px-8 rounded-full bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 duration-200 w-full sm:w-auto hover:-translate-y-1">
            View Work <ArrowUpRight size={18} />
          </a>
          <a href="/resume.pdf" download title="Download resume (PDF)" className="hero-btn h-12 px-8 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white font-medium flex items-center justify-center gap-2 hover:bg-black hover:border-white transition-all active:scale-95 duration-200 w-full sm:w-auto hover:-translate-y-1">
            <Download size={18} /> Résumé
          </a>
          <a href="https://github.com/Kaushikfunde" target="_blank" rel="me noopener noreferrer" className="hero-btn h-12 px-8 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm text-white font-medium flex items-center justify-center gap-2 hover:bg-black hover:border-white transition-all active:scale-95 duration-200 w-full sm:w-auto hover:-translate-y-1">
            <Github size={18} /> GitHub
          </a>
        </div>
      </div>
    </div>
  </section>
);

const About = () => {
  const sectionRef = useRef(null);
  const blobRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blobRef.current, {
        y: 60,
        x: -40,
        rotate: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="scroll-mt-24 py-20 px-6 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div ref={blobRef} className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      
    <div className="max-w-6xl mx-auto relative z-10">
      <ScrollWordReveal className="text-3xl md:text-4xl font-bold text-white mb-10 md:mb-12">About Me</ScrollWordReveal>

      <div className="grid md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Bio */}
        <div className="md:col-span-7 space-y-6">
          <ScrollReveal delay={100}>
            <p className="text-zinc-400 text-lg leading-relaxed">
              I'm <span className="text-white font-medium">Kaushik Funde</span>, a second-year Electronics Engineering student at G. H. Raisoni College of Engineering, Nagpur, with a deep passion for the intersection of hardware and software. 
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
              <p className="text-zinc-400 text-sm leading-relaxed">
                Obsessed with embedded systems, PCB design, and making dumb devices smart via IoT.
              </p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={400}>
            <div className="p-6 rounded-2xl bg-zinc-900/20 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="text-red-400" size={20} />
                <h3 className="text-white font-bold">Open Source</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                I document my builds and share the schematics, firmware, and lessons so others can reproduce them.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  </section>
  );
};

const projects = [
  {
    id: "atmos",
    title: "Project Atmos",
    subtitle: "ESP32 Environmental Data Logger",
    category: "Embedded system",
    year: "2026",
    status: "Completed",
    icon: Cpu,
    desc: "A headless ESP32 logger that captures temperature, humidity, and barometric pressure to microSD with NTP-stamped CSV rows.",
    tags: ["ESP32", "Embedded C++", "I²C", "SPI", "Sensors"],
    specs: [
      { label: "MCU", value: "ESP32 DevKit" },
      { label: "Sensors", value: "DHT11 · LM35 · BMP280" },
      { label: "Storage", value: "microSD · CSV via SPI" },
      { label: "Timekeeping", value: "NTP-synced timestamps" },
    ],
    sections: [
      {
        title: "The problem",
        body: "Environmental logging usually means leaving a laptop attached or trusting a cloud connection. I wanted a self-contained logger that could run unattended, timestamp its own readings, and keep the data locally.",
      },
      {
        title: "The build",
        body: "DHT11 and BMP280 handle humidity, pressure, and ambient temperature; an LM35 adds an analog temperature channel. The ESP32 syncs time over NTP at boot, then writes CSV rows to a microSD card over SPI.",
      },
      {
        title: "What went wrong",
        body: "Bring-up surfaced a WPA3 incompatibility, an exFAT mount failure, and an async NTP race that discarded timestamps. An overnight stress test also destroyed the OLED when the SD card's current spikes hit the shared 3.3 V rail. The fix was proper rail decoupling and a pivot to a headless build with an LED heartbeat.",
      },
      {
        title: "The result",
        body: "A stable, display-free logger that records long runs to CSV. The post-mortem documents the failure and the next revision: an RTC for offline timekeeping and a local ESP32 web dashboard.",
      },
    ],
    images: [
      {
        src: "/projects/atmos-esp32.jpg",
        alt: "ESP32 development board used in Project Atmos",
        caption: "ESP32 DevKit — the core of the headless logger.",
      },
      {
        src: "/projects/atmos-bmp280.jpg",
        alt: "BMP280 barometric pressure sensor on a breadboard",
        caption: "BMP280 pressure and temperature sensor.",
      },
    ],
    note: "Personal project · August 2026",
  },
  {
    id: "pwm-analyzer",
    title: "PWM Signal Generator & Analyzer",
    subtitle: "NE555 + ESP32 + custom KiCad PCB",
    category: "Course project",
    year: "2026",
    status: "Prototype",
    icon: CircuitBoard,
    repo: "https://github.com/Kaushikfunde/PWM-Signal-Generator",
    desc: "A dual-range NE555 PWM generator paired with an ESP32 frequency counter, designed as a custom single-sided PCB.",
    tags: ["NE555", "ESP32", "KiCad", "PCB Design", "Embedded C"],
    specs: [
      { label: "Generator", value: "NE555 astable · 5 V" },
      { label: "Ranges", value: "1 µF / 150 nF · DPDT select" },
      { label: "Analyzer", value: "ESP32 frequency counter · GPIO34 interrupt" },
      { label: "Display", value: "128 × 64 I²C OLED" },
      { label: "Input stage", value: "330 Ω series · 10 kΩ load (rev A)" },
      { label: "PCB", value: "KiCad · single-sided · hand-assembled" },
    ],
    sections: [
      {
        title: "The problem",
        body: "A standalone 555 timer can generate a square wave, but it cannot report its own frequency, and its 5 V output is not safe to feed directly into a 3.3 V ESP32.",
      },
      {
        title: "The build",
        body: "The NE555 runs in astable mode with two switchable timing capacitors and a potentiometer for tuning. A series resistor limits current into GPIO34 while a 10 kΩ load holds the input node low. The firmware counts rising edges over a one-second gate, computes frequency, and refreshes the OLED about four times a second. Duty-cycle measurement and automatic range sensing are scoped for the next board revision.",
      },
      {
        title: "The board",
        body: "The full circuit was drawn and laid out in KiCad as a single-sided board, then etched and partly assembled by hand. The breadboard prototype validated the oscillator and measurement firmware; final PCB integration is the remaining step.",
      },
      {
        title: "The result",
        body: "A compact generator with live frequency on an onboard display and a screw-terminal output for external probing. Built as a five-person course project in the 3rd semester; the frequency counter is validated on the breadboard, while final PCB integration remains in progress.",
      },
    ],
    images: [
      {
        src: "/projects/pwm-pcb.jpg",
        alt: "Custom single-sided KiCad PCB for the PWM analyzer",
        caption: "Single-sided KiCad board, etched and partly assembled by hand.",
      },
      {
        src: "/projects/pwm-breadboard.jpg",
        alt: "Breadboard prototype of the NE555 oscillator and ESP32 analyzer",
        caption: "Breadboard bring-up of the NE555 oscillator and ESP32 analyzer.",
      },
    ],
    note: "Five-person course project · 3rd semester · 2026",
  },
];

const ProjectCard = ({ project, onClick }) => {
  const Icon = project.icon;
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const motionRef = useRef(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    motionRef.current = !reduceMotion && finePointer;
  }, []);

  const handlePointerMove = (event) => {
    if (!motionRef.current || event.pointerType !== 'mouse') return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateX: -y * 5,
      rotateY: x * 6,
      y: -8,
      scale: 1.01,
      transformPerspective: 900,
      duration: 0.55,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0.55,
        x: x * 60,
        y: y * 40,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const handlePointerLeave = () => {
    if (!motionRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.to(glareRef.current, { opacity: 0, x: 0, y: 0, duration: 0.6, overwrite: 'auto' });
  };

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] p-6 md:p-8 text-left transition-[border-color,box-shadow] duration-300 hover:shadow-2xl hover:shadow-blue-900/20 hover:border-white/20 will-change-transform"
    >
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-label={`View case study: ${project.title}`}
        className="absolute inset-0 z-20 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
      />

      {project.images.length > 0 && (
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" aria-hidden="true">
          <img
            src={project.images[0].src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full scale-105 object-cover opacity-20 grayscale transition-transform duration-[1200ms] ease-out group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/75 to-[#0A0A0A]/35" />
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-green-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div
        ref={glareRef}
        className="pointer-events-none absolute -inset-x-1/4 -top-1/2 h-[200%] w-[150%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute -bottom-2 right-4 font-mono text-6xl font-bold leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-white/[0.07]" aria-hidden="true">
        {String(projects.findIndex((item) => item.id === project.id) + 1).padStart(2, '0')}
      </div>

      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
        <ArrowUpRight className="text-white" size={20} />
      </div>

      <div className="h-full flex flex-col justify-between relative z-10">
        <div className="mb-6">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center mb-4 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300">
            <Icon size={20} className="text-zinc-400 group-hover:text-white transition-colors duration-300" />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400 mb-2">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
          </div>
          <h3 className="text-xl font-bold text-zinc-100 mb-1 group-hover:text-white transition-colors">{project.title}</h3>
          <p className="text-sm text-zinc-400 mb-3">{project.subtitle}</p>
          <p className="text-zinc-400 leading-relaxed text-sm">{project.desc}</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-white/5 text-zinc-400 border border-white/5 group-hover:border-white/20 group-hover:bg-white/10 transition-all">
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors">
            View case study <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
};

const ProjectModal = ({ project, onClose }) => {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    previousFocus.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus();
      }
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-${project.id}-title`}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        data-lenis-prevent
        className="modal-scroll relative w-full max-w-3xl max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] overflow-y-auto overscroll-contain touch-pan-y rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-2xl animate-modal-in"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/5 bg-[#0A0A0A]/95 px-4 py-3 backdrop-blur sm:px-6">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">Case study</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="p-2 rounded-full border border-white/10 bg-black/60 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.year}</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-zinc-300">
              {project.status}
            </span>
          </div>

          <h3 id={`project-${project.id}-title`} className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-white">
            {project.title}
          </h3>
          <p className="mt-1 text-lg text-zinc-300">{project.subtitle}</p>
          <p className="mt-4 text-zinc-400 leading-relaxed">{project.desc}</p>

          {project.images.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              {project.images.map((image) => (
                <figure key={image.src} className="overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full aspect-square object-cover"
                  />
                  <figcaption className="px-3 py-2 text-xs text-zinc-400">{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          )}

          <dl className="grid sm:grid-cols-2 gap-3 mt-8">
            {project.specs.map((spec) => (
              <div key={spec.label} className="rounded-xl border border-white/5 bg-zinc-900/30 p-4">
                <dt className="text-[10px] font-mono uppercase tracking-[0.15em] text-zinc-400">{spec.label}</dt>
                <dd className="mt-1 text-sm text-zinc-200">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 space-y-5">
            {project.sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-sm font-semibold text-white">{section.title}</h4>
                <p className="mt-1 text-sm md:text-base text-zinc-400 leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-white/5 text-zinc-400 border border-white/5">
                {tag}
              </span>
            ))}
          </div>

          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Github size={16} />
              View source on GitHub
              <ArrowUpRight size={14} className="text-zinc-400" />
            </a>
          )}

          <p className="mt-6 border-t border-white/5 pt-4 text-xs text-zinc-400">{project.note}</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

const getProjectFromHash = () => {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(/^#\/work\/([^/?#]+)/);
  if (!match) return null;
  return projects.find((project) => project.id === match[1]) ?? null;
};

const Projects = () => {
  const [activeProject, setActiveProject] = useState(() => getProjectFromHash());
  const returnHashRef = useRef('');
  const underlineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        underlineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: underlineRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, underlineRef);

    const syncFromUrl = () => setActiveProject(getProjectFromHash());
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
      ctx.revert();
    };
  }, []);

  const openProject = (project) => {
    if (project.id === activeProject?.id) return;
    const currentHash = window.location.hash;
    if (!currentHash.startsWith('#/work/')) {
      returnHashRef.current = currentHash;
    }
    window.history.pushState(null, '', `#/work/${project.id}`);
    setActiveProject(project);
  };

  const closeProject = () => {
    setActiveProject(null);
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search + returnHashRef.current
    );
  };

  return (
    <section id="projects" className="scroll-mt-24 py-20 md:py-32 px-6 border-t border-white/5 bg-black">
      <div className="max-w-6xl mx-auto">
        <ScrollWordReveal className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 inline-block">Selected Work</ScrollWordReveal>
            <p className="text-zinc-400">Two builds from the bench — embedded firmware, sensors, and a custom PCB.</p>
            <div
              ref={underlineRef}
              className="mt-6 h-[2px] w-[60px] bg-gradient-to-r from-blue-500 via-violet-500 to-red-500 origin-left scale-x-0"
            />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <ScrollReveal key={project.id} delay={(index + 1) * 100} className="h-full">
              <ProjectCard project={project} onClick={() => openProject(project)} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={closeProject} />
      )}
    </section>
  );
};

const Experience = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw the vertical timeline line
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, origin: 'top' },
        {
          scaleY: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Stagger reveal each job entry
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.tl-item'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="scroll-mt-24 py-20 md:py-32 px-6 border-t border-white/5 bg-black">
      <div className="max-w-3xl mx-auto">
        <ScrollWordReveal className="text-3xl md:text-4xl font-bold mb-12">Work History</ScrollWordReveal>
        
        <div className="relative border-l border-zinc-800 ml-3 space-y-16">
          <div ref={lineRef} className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-zinc-600 to-transparent origin-top scale-y-0" />
          {[
            { 
              role: "Independent Hardware & Firmware Projects",
              company: "Self-Initiated Builds", 
              period: "2024 — Present", 
              desc: "Designing and building embedded systems end-to-end: ESP32 sensor nodes, custom KiCad PCBs, sensor bring-up, and C/C++ firmware. Recent builds include an environmental data logger and a NE555/ESP32 PWM analyzer." 
            },
          ].map((job, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="tl-item relative pl-8 md:pl-12 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-black border border-zinc-600 ring-4 ring-black group-hover:border-white group-hover:scale-125 transition-all duration-300" />
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h3 className="text-xl font-bold text-zinc-100">{job.role}</h3>
                <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-white/5 mt-1 sm:mt-0 w-fit">{job.period}</span>
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
};

const Education = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0, origin: 'top' },
        {
          scaleY: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.edu-item'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.2,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="education" className="scroll-mt-24 py-20 px-6 border-t border-white/5 bg-black">
      <div className="max-w-3xl mx-auto">
        <ScrollWordReveal className="text-3xl md:text-4xl font-bold mb-10 md:mb-12">Education</ScrollWordReveal>

        <div className="relative border-l border-zinc-800 ml-3 space-y-12">
          <div ref={lineRef} className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-zinc-600 to-transparent origin-top scale-y-0" />
          <ScrollReveal delay={100}>
              <div className="edu-item relative pl-8 md:pl-12 group">
                  <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-black border border-zinc-600 ring-4 ring-black group-hover:border-blue-500 group-hover:scale-125 transition-all duration-300" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <div>
                          <h3 className="text-xl font-bold text-white">Bachelor of Technology</h3>
                          <p className="text-blue-400 font-medium text-sm mt-1">Electronics Engineering</p>
                          <p className="text-zinc-400 text-sm mt-1">G. H. Raisoni College of Engineering, Nagpur</p>
                      </div>
                      <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mt-2 sm:mt-0 w-fit">2025 - Present</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-2 max-w-xl">Currently in the 3rd semester (2nd year), focusing on core electronics, embedded programming, and hardware fundamentals.</p>
              </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
              <div className="edu-item relative pl-8 md:pl-12 group">
                  <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-black border border-zinc-600 ring-4 ring-black group-hover:border-white group-hover:scale-125 transition-all duration-300" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="text-lg font-bold text-zinc-200">Higher Secondary (12th Grade)</h3>
                      <span className="text-zinc-400 text-xs font-mono bg-zinc-900 px-2 py-1 rounded border border-white/5 mt-2 sm:mt-0 w-fit">2022 - 2024</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                      <span className="text-zinc-400 text-sm">Percentage:</span>
                      <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded text-sm">75.67%</span>
                  </div>
              </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
              <div className="edu-item relative pl-8 md:pl-12 group">
                  <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-black border border-zinc-600 ring-4 ring-black group-hover:border-green-500 group-hover:scale-125 transition-all duration-300" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="text-lg font-bold text-zinc-200">Secondary School (10th Grade)</h3>
                      <span className="text-zinc-400 text-xs font-mono bg-zinc-900 px-2 py-1 rounded border border-white/5 mt-2 sm:mt-0 w-fit">2021 - 2022</span>
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
};

// --- Favorite Tools Section (FIXED URLS to resolve 404 Errors) ---
const FavoriteTools = () => {
  const tools = [
    { name: "VS Code", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
    { name: "Android Studio", url: "/tools/androidstudio.svg" },
    { name: "Git", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
    { name: "GitHub", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
    { name: "Notion", url: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" }, 
    { name: "Obsidian", url: "https://cdn.simpleicons.org/obsidian" },
    { name: "Docker", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
    { name: "MATLAB", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg" },
    { name: "Arduino", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" },
    { name: "KiCad", url: "https://cdn.simpleicons.org/kicad" }, 
    { name: "SolidWorks", url: "/tools/solidworks.png" },
  ];

  return (
    <section id="tools" className="scroll-mt-24 py-20 md:py-24 px-6 border-t border-white/5 bg-black">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 bg-zinc-900 rounded-lg border border-white/10">
              <Terminal size={24} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Favorite Tools</h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {tools.map((tool, index) => (
            <ScrollReveal key={tool.name} delay={index * 50}>
              <div className="group flex min-w-0 items-center gap-3 p-3 sm:p-4 rounded-xl bg-zinc-900/20 border border-white/5 hover:border-white/10 hover:bg-zinc-900/40 transition-all duration-300 hover:-translate-y-1 cursor-default">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-black rounded-lg border border-white/10 group-hover:border-white/20 transition-colors flex-shrink-0 p-2">
                  <img 
                    src={tool.url} 
                    alt={tool.name}
                    loading="lazy"
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                <span className="min-w-0 truncate text-zinc-400 font-medium text-xs sm:text-sm group-hover:text-white transition-colors">
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
    <Icon size={18} className="text-zinc-400 group-hover:text-white transition-colors duration-300 flex-shrink-0" />
    <span className="text-zinc-400 text-sm font-medium transition-colors duration-300 group-hover:text-white">{name}</span>
  </div>
);

const Skills = () => (
  <section id="skills" className="scroll-mt-24 py-20 md:py-32 px-6 border-t border-white/5 bg-black relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
    
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
          { i: Layers, n: "PCB Design" },
          { i: Globe, n: "IoT / MQTT" }, { i: Terminal, n: "Python" }
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
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelectorAll('.contact-reveal'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
    <section ref={sectionRef} id="contact" className="scroll-mt-24 py-20 md:py-32 px-6 border-t border-white/5 bg-black text-center relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-white/5 to-transparent blur-[100px] rounded-full pointer-events-none" />
      
      <ScrollReveal>
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-600">
            Ready to ship?
          </h2>
          
          {formState === 'success' ? (
              <div className="contact-reveal p-8 bg-zinc-900/50 border border-white/10 rounded-2xl animate-fade-in-up" role="status" aria-live="polite">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-2xl font-bold text-white mb-2">Message Received.</h3>
                <p className="text-zinc-400">I'll get back to you within 24 hours.</p>
                <button onClick={() => setFormState('idle')} className="mt-6 text-sm text-zinc-400 underline hover:text-white">Send another</button>
              </div>
          ) : (
            <form className="contact-reveal space-y-4 text-left bg-zinc-900/30 p-6 md:p-8 rounded-2xl border border-white/5 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-zinc-900/40" onSubmit={handleSubmit}>
                <p className="contact-reveal text-lg text-zinc-400 mb-6 text-center">
                    Currently available for freelance work and open source collaborations.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="contact-reveal space-y-1">
                        <label htmlFor="name" className="text-xs font-medium text-zinc-400 uppercase ml-1">Name</label>
                        <input id="name" name="name" required type="text" autoComplete="name" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="John Doe" />
                    </div>
                    <div className="contact-reveal space-y-1">
                        <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase ml-1">Email</label>
                        <input id="email" name="email" required type="email" autoComplete="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="john@example.com" />
                    </div>
                </div>
                <div className="contact-reveal space-y-1">
                    <label htmlFor="message" className="text-xs font-medium text-zinc-400 uppercase ml-1">Message</label>
                    <textarea id="message" name="message" required rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" placeholder="Tell me about your project..." />
                </div>
                
                <button className="contact-reveal w-full py-4 rounded-xl font-bold text-black bg-white hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2" disabled={formState === 'loading'}>
                    {formState === 'loading' ? <Loader className="animate-spin" /> : <><Send size={18} /> Send Message</>}
                </button>
                
                {/* Error Message Display */}
                {result && <p role="alert" className="text-red-500 text-sm text-center mt-2">{result}</p>}
            </form>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
};

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current?.querySelectorAll('.footer-reveal'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="py-12 px-6 border-t border-white/10 bg-black">
    <div className="max-w-6xl mx-auto">
      <div className="footer-reveal flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/5 w-fit hover:border-white/20 transition-colors">
            <div className="flex gap-1 items-end h-4">
              <span className="w-1 h-2 bg-green-500 animate-[music-bar_1s_ease-in-out_infinite]" />
              <span className="w-1 h-3 bg-green-500 animate-[music-bar_1.2s_ease-in-out_infinite_0.1s]" />
              <span className="w-1 h-1 bg-green-500 animate-[music-bar_0.8s_ease-in-out_infinite_0.2s]" />
            </div>
            <div className="text-xs">
              <p className="text-zinc-400 font-medium uppercase tracking-wider text-[10px]">Now Listening</p>
              <p className="text-zinc-300 font-medium">Happy Nation - 1992</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
              <BookOpen size={14} />
              <span>Learning: Python & Django</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
              <MapPin size={14} />
              <span>Nagpur, Maharashtra, India</span>
          </div>
        </div>

        {/* --- UPDATED SOCIAL LINKS SECTION --- */}
        <div className="flex gap-6">
          {/* 1. Twitter / X Link */}
          <a 
            href="https://x.com/KaushikFunde" 
            target="_blank" 
            rel="me noopener noreferrer"
            className="text-zinc-400 transition-all hover:scale-110 hover:text-blue-400"
            aria-label="Kaushik Funde on X"
          >
            <Twitter size={20} />
          </a>

          {/* 2. LinkedIn Link */}
          <a 
            href="https://www.linkedin.com/in/kaushik-funde-239925373/" 
            target="_blank" 
            rel="me noopener noreferrer"
            className="text-zinc-400 transition-all hover:scale-110 hover:text-blue-600"
            aria-label="Kaushik Funde on LinkedIn"
          >
            <Linkedin size={20} />
          </a>

          {/* 3. GitHub Link */}
          <a 
            href="https://github.com/Kaushikfunde" 
            target="_blank" 
            rel="me noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-all hover:scale-110"
            aria-label="Kaushik Funde on GitHub"
          >
            <Github size={20} />
          </a>

          {/* 4. Email Link (mailto:) */}
          <a 
            href="mailto:kaushikfunde401@gmail.com" 
            className="text-zinc-400 hover:text-white transition-all hover:scale-110"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
        </div>
        {/* ------------------------------------ */}

      </div>

      <div className="footer-reveal flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
        <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>All systems normal</span>
        </div>
        <p className="text-zinc-400 text-xs">© {new Date().getFullYear()} Kaushik Funde. All rights reserved. Unauthorized copying or reuse prohibited.</p>
      </div>
    </div>
  </footer>
  );
};

// --- Main App ---

export default function App() {
  useSmoothScroll();

  return (
    <div className="page-enter min-h-screen bg-black text-white font-sans selection:bg-white/20 overflow-x-clip w-full">
        <style>{`
          body { 
            font-family: 'Inter', sans-serif; 
            background-color: #000;
            overflow-x: clip; 
            width: 100%;
            -webkit-text-size-adjust: 100%;
          }
          
          html { scroll-behavior: auto; overflow-x: clip; scrollbar-gutter: stable; }
          
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

          /* First-load fade-in */
          .page-enter {
            animation: pageFadeIn 0.8s ease-out both;
          }

          @keyframes pageFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          /* Keep the case-study panel scrollable without showing a scrollbar. */
          .modal-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .modal-scroll::-webkit-scrollbar {
            display: none;
          }

          .menu-inner {
            justify-content: center;
            min-height: calc(100dvh - 12rem);
          }

          @media (max-height: 700px) {
            .menu-inner {
              justify-content: flex-start;
              min-height: 0;
            }
          }

          .bg-grid {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            -webkit-mask-image: linear-gradient(to bottom, black 10%, transparent 100%);
            mask-image: linear-gradient(to bottom, black 10%, transparent 100%);
          }

          @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
            *, *::before, *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>

        <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
        <ScrollProgress />
        
        <div className="relative z-10 w-full max-w-[100vw] overflow-x-clip">
          <Nav />
          <main>
            <Hero />
            <Manifesto />
            <About />
            <Projects />
            <Experience />
            <Education />
            <FavoriteTools />
            <Skills />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
  );
}