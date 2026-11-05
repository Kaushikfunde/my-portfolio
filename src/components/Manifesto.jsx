import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATEMENT =
  'I build at the intersection of hardware and software — from the first schematic to the final interface.';

const ACCENTS = {
  hardware: '#60a5fa',
  software: '#f87171',
  schematic: '#a78bfa',
  interface: '#34d399',
};

export default function Manifesto() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = textRef.current?.querySelectorAll('[data-word]');
    if (!words || !words.length) return undefined;

    if (reduceMotion) {
      gsap.set(words, { color: '#f4f4f5' });
      gsap.set(progressRef.current, { scaleX: 1 });
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        words,
        { color: '#71717a' },
        {
          color: (index, element) => element.dataset.accent || '#f4f4f5',
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        }
      );

      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, []);

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="relative border-t border-white/5 bg-black"
    >
      <div className="h-[220vh] motion-reduce:h-auto">
        <div className="sticky top-0 flex min-h-screen items-center px-5 py-20 sm:px-6 sm:py-24 motion-reduce:static motion-reduce:min-h-0 motion-reduce:py-28">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8 sm:mb-10 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-400">
              <span className="shrink-0 text-zinc-300">01 / Manifesto</span>
              <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
              <span className="shrink-0">Scroll to read</span>
            </div>

            <p
              ref={textRef}
              className="max-w-5xl text-2xl font-medium leading-[1.2] tracking-tight sm:text-4xl md:text-6xl lg:text-7xl"
            >
              {STATEMENT.split(' ').map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  data-word
                  data-accent={ACCENTS[word.replace(/[^a-z]/gi, '').toLowerCase()]}
                  className="mr-[0.24em] inline-block"
                >
                  {word}
                </span>
              ))}
            </p>

            <div className="mt-10 sm:mt-14 flex items-center gap-6">
              <div className="h-px flex-1 bg-white/10">
                <div
                  ref={progressRef}
                  className="h-px w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 via-violet-500 to-red-500"
                />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-400">
                Design · Build · Debug
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
