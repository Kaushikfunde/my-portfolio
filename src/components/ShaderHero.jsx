import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(
        mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
        f.y
      ),
      mix(
        mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
        f.y
      ),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    value += 0.5 * noise(p);
    p *= 2.02;
    value += 0.25 * noise(p);
    p *= 2.03;
    value += 0.125 * noise(p);
    return value;
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);

    float displacement = fbm(position * 1.65 + vec3(0.0, uTime * 0.16, uTime * 0.04));
    vec3 transformed = position + normal * (displacement - 0.44) * 0.5;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 2.4);

    float band = 0.5 + 0.5 * sin(normal.y * 3.2 + normal.x * 1.4 + uTime * 0.22);

    vec3 deep = vec3(0.015, 0.025, 0.08);
    vec3 blue = vec3(0.16, 0.38, 1.0);
    vec3 violet = vec3(0.55, 0.25, 0.95);
    vec3 red = vec3(1.0, 0.2, 0.28);

    vec3 color = mix(deep, blue, smoothstep(0.0, 0.55, band));
    color = mix(color, violet, smoothstep(0.5, 0.85, band));
    color = mix(color, red, smoothstep(0.86, 1.0, band) * 0.65);
    color += fresnel * vec3(0.65, 0.78, 1.0);

    gl_FragColor = vec4(color, 0.82 + fresnel * 0.18);
  }
`;

export default function ShaderHero() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (error) {
      console.warn('WebGL unavailable for hero visual.', error);
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 4.1);

    const uniforms = { uTime: { value: 0 } };

    const orbGeometry = new THREE.IcosahedronGeometry(1.12, 5);
    const orbMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.rotation.set(-0.2, 0.4, 0);

    const wireGeometry = new THREE.IcosahedronGeometry(1.82, 1);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x6d7cff,
      transparent: true,
      opacity: 0.07,
    });
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeometry), wireMaterial);

    const particleCount = 1100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const palette = [new THREE.Color('#3b82f6'), new THREE.Color('#8b5cf6'), new THREE.Color('#ef4444')];

    for (let i = 0; i < particleCount; i += 1) {
      const radius = 1.55 + Math.random() * 1.55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      const color = palette[i % palette.length];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.018,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);

    const group = new THREE.Group();
    group.add(wire, orb, particles);
    scene.add(group);

    const pointer = { x: 0, y: 0 };
    let running = true;
    let frameId = 0;
    const timer = new THREE.Timer();
    timer.connect(document);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      if (reduceMotion) {
        uniforms.uTime.value = 1.3;
        renderer.render(scene, camera);
      }
    };

    const animate = () => {
      if (!running || document.hidden) {
        frameId = 0;
        return;
      }

      timer.update();
      const elapsed = timer.getElapsed();
      uniforms.uTime.value = elapsed;

      group.rotation.y = elapsed * 0.075 + pointer.x * 0.38;
      group.rotation.x = -0.12 - pointer.y * 0.24;
      group.position.y = -Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1) * 0.24;

      particles.rotation.y = -elapsed * 0.028;
      particles.rotation.x = elapsed * 0.012;
      wire.rotation.y = elapsed * 0.04;
      wire.rotation.x = -elapsed * 0.02;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (reduceMotion || frameId) return;
      frameId = requestAnimationFrame(animate);
    };

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const handlePointerMove = (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = container.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
    };

    const handlePointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else if (running) start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) start();
        else stop();
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('visibilitychange', handleVisibility);

    resize();
    if (!reduceMotion) start();

    return () => {
      stop();
      timer.disconnect();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);

      orbGeometry.dispose();
      orbMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative mx-auto aspect-square w-full max-w-[520px] lg:max-w-none">
      <div className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_38%_30%,rgba(59,130,246,0.42),rgba(139,92,246,0.2)_48%,rgba(239,68,68,0.14)_68%,transparent_74%)] blur-3xl" />
      <div className="absolute inset-[9%] rounded-full border border-white/5" />
      <div className="absolute inset-[20%] rounded-full border border-white/10" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-400">
        KF / WebGL-01
      </div>
      <div className="pointer-events-none absolute right-5 top-5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
    </div>
  );
}
