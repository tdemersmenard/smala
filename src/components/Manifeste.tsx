import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../lib/useReducedMotion'

const TITLE = ['Ride', 'Your', 'Tribe']

export function Manifeste() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reduced || !ref.current) return
    const ctx = gsap.context(() => {
      // Révélation au montage, en stagger par mot (pas gated par viewport).
      gsap.from('.manifeste-word', {
        yPercent: 110,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
      })
    }, ref)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section ref={ref} className="topo relative min-h-dvh place-content-center overflow-hidden px-5 py-28 md:px-10">
      <div className="mx-auto grid max-w-[1400px] items-end gap-10 md:grid-cols-[1fr_auto]">
        <h2 className="relative font-display text-[18vw] leading-[0.82] text-os uppercase md:text-[13vw]">
          {/* Chevrons signature (comme la bannière de marque). */}
          <span aria-hidden="true" className="absolute -top-[0.15em] -left-[0.42em] text-[0.5em] text-sarcelle">
            &lsaquo;
          </span>
          {TITLE.map((word) => (
            <span key={word} className="block overflow-hidden">
              <span className="manifeste-word block">{word}</span>
            </span>
          ))}
          <span aria-hidden="true" className="absolute -bottom-[0.05em] right-[0.05em] text-[0.5em] text-sarcelle">
            &rsaquo;
          </span>
        </h2>

        <p className="max-w-[34ch] text-base leading-relaxed text-os/75 md:pb-6">
          Des vans construites par une famille de passionnés, pour les tribus qui veulent
          tout plaquer et partir.
        </p>
      </div>
    </section>
  )
}
