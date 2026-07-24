import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './useReducedMotion'
import { setLenis } from './lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * Pont Lenis -> GSAP. On coupe le RAF interne de Lenis (`autoRaf: false`) et on
 * l'avance depuis `gsap.ticker` : sans ça, le scrub des ScrollTrigger saccade
 * parce que Lenis et GSAP tournent sur deux horloges différentes.
 *
 * `prefers-reduced-motion` : aucun smooth scroll, on laisse le scroll natif.
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })

    // Lenis notifie GSAP à chaque changement de scroll.
    lenis.on('scroll', ScrollTrigger.update)

    // Partagé pour que VanBuild puisse geler le scroll pendant sa séquence.
    setLenis(lenis)

    // Handle de debug (dev uniquement) : pratique pour piloter/inspecter le
    // scroll depuis la console. Absent des builds de production.
    if (import.meta.env.DEV) (window as unknown as { __lenis?: Lenis }).__lenis = lenis

    const raf = (time: number) => {
      // gsap.ticker donne des secondes ; Lenis attend des millisecondes.
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      setLenis(null)
      lenis.destroy()
    }
  }, [])
}
