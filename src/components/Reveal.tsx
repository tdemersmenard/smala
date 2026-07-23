import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  children: ReactNode
  className?: string
  /** Décalage en secondes entre les enfants directs (effet cascade). */
  stagger?: number
  y?: number
  as?: 'div' | 'ol' | 'ul'
}

/**
 * Révèle ses enfants directs (fade + léger glissé vers le haut) quand la section
 * entre dans le viewport. Transform/opacity uniquement, respecte reduced-motion.
 */
export function Reveal({ children, className, stagger = 0.1, y = 26, as = 'div' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from(Array.from(el.children), {
        y,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: el, start: 'top 82%' },
      })
    }, el)
    return () => ctx.revert()
  }, [stagger, y])

  const Tag = as as 'div'
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  )
}
