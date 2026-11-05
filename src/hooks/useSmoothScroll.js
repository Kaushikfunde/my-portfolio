import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

if (import.meta.env.DEV) {
  window.__gsap = gsap;
  window.__ScrollTrigger = ScrollTrigger;
}

/**
 * Premium smooth scrolling:
 * - Lenis drives the scroll position
 * - GSAP's ticker drives Lenis (one RAF loop)
 * - ScrollTrigger updates from Lenis
 * - anchor links get an eased scroll with a fixed-header offset
 *
 * Disabled automatically for users who prefer reduced motion.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    });

    window.__lenis = lenis;

    if (document.body.style.overflow === 'hidden') {
      lenis.stop();
    }

    const updateScrollTrigger = () => ScrollTrigger.update();
    lenis.on('scroll', updateScrollTrigger);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.length < 2 || href.startsWith('#/')) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      lenis.start();
      lenis.scrollTo(target, { duration: 1.25 });
      history.replaceState(null, '', href);
    };

    document.addEventListener('click', handleAnchorClick);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts?.ready) document.fonts.ready.then(refresh);

    const initialHash = window.location.hash;
    if (initialHash.length > 1 && !initialHash.startsWith('#/')) {
      const target = document.querySelector(initialHash);
      if (target) {
        requestAnimationFrame(() => {
          lenis.scrollTo(target, { immediate: true });
          ScrollTrigger.refresh();
        });
      }
    }

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = undefined;
    };
  }, []);
}
