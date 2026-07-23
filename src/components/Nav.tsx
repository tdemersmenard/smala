import { useEffect, useState } from 'react'
import { Logo } from './Logo'

const LINKS = [
  { href: '#processus', label: 'Le processus' },
  { href: '#soumission', label: 'Contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? 'border-b border-os/10 bg-sapin-profond/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-10">
        <a href="#top" aria-label="Smala, retour en haut" className="transition-opacity hover:opacity-80">
          <Logo className="h-7 md:h-8" />
        </a>

        <div className="flex items-center gap-7 md:gap-10">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative hidden font-body text-sm text-os/75 transition-colors hover:text-os sm:inline"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-sarcelle transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
          {/* Soumission = CTA primaire de la nav (chrome propre, coins vifs). */}
          <a
            href="#soumission"
            className="group relative inline-flex items-center overflow-hidden border border-sarcelle px-4 py-2 active:scale-[0.98]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-sarcelle transition-transform duration-300 ease-out group-hover:scale-y-100"
            />
            <span className="relative font-mono text-xs tracking-wide text-os uppercase transition-colors duration-300 group-hover:text-encre">
              Soumission
            </span>
          </a>
        </div>
      </nav>
    </header>
  )
}
