import { SmartImage } from './SmartImage'
import { Reveal } from './Reveal'

/**
 * Respiration plein cadre : une vraie photo d'intérieur fini, avec une phrase
 * forte sur le savoir-faire. Preuve tangible entre le manifeste et le processus.
 */
export function Atelier() {
  return (
    <section className="relative min-h-[85dvh] overflow-hidden bg-sapin-profond">
      <SmartImage
        src="/photos/van-cuisine.jpg"
        alt="Intérieur d'une van Smala finie : comptoir de bambou, banquette et rangements"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* Voile pour la lisibilité du texte. */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-sapin-profond via-sapin-profond/50 to-sapin-profond/20"
        aria-hidden="true"
      />

      <div className="relative flex min-h-[85dvh] items-end">
        <Reveal className="mx-auto w-full max-w-[1400px] px-5 pb-16 md:px-10 md:pb-24" stagger={0.12}>
          <p className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-sarcelle uppercase">
            <span className="h-px w-8 bg-sarcelle/60" />
            L&rsquo;atelier
          </p>
          <h2 className="max-w-[16ch] font-display text-4xl leading-[0.95] text-os uppercase md:text-7xl">
            Fait à la main, au Québec
          </h2>
          <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-os/80 md:text-lg">
            Bambou massif, isolation quatre saisons, rangements pensés au millimètre.
            Chaque van sort de notre atelier prête à affronter l&rsquo;hiver comme les grands départs.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
