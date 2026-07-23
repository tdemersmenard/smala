import { DemanderSoumission } from './cta/DemanderSoumission'
import { DecouvrirProcessus } from './cta/DecouvrirProcessus'
import { Reveal } from './Reveal'

/**
 * Écran d'ouverture, avant le pin de construction. Eyebrow, headline (2 lignes)
 * encadrée des chevrons signature de la marque, sous-texte, 2 CTA.
 */
export function Hero() {
  return (
    <section id="top" className="topo relative flex min-h-dvh items-center overflow-hidden">
      <div className="mx-auto w-full max-w-[1400px] px-5 pt-28 pb-16 md:px-10">
        <Reveal stagger={0.12}>
          <p className="mb-6 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-sarcelle uppercase">
            <span className="h-px w-8 bg-sarcelle/60" />
            Mercedes Sprinter · Quatre saisons · Québec
          </p>

          <div className="relative max-w-[20ch]">
            <span aria-hidden="true" className="absolute -top-4 -left-6 font-display text-3xl text-sarcelle md:-left-9 md:text-5xl">
              &lsaquo;
            </span>
            <h1 className="font-display text-5xl leading-[0.92] text-os uppercase md:text-7xl">
              On construit
              <br />
              ta liberté
            </h1>
            <span aria-hidden="true" className="absolute -bottom-2 right-0 font-display text-3xl text-sarcelle md:text-5xl">
              &rsaquo;
            </span>
          </div>

          <p className="mt-8 max-w-[52ch] text-base leading-relaxed text-os/80 md:text-lg">
            Conversion de Mercedes Sprinter en vans aménagées quatre saisons, construites à
            la main au Québec par une famille de passionnés.
          </p>

          <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
            <DemanderSoumission />
            <DecouvrirProcessus />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
