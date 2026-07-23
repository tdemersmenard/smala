import { Reveal } from './Reveal'

const ETAPES = [
  { n: '01', titre: 'Rencontre et design', ligne: 'On écoute ton projet, ta manière de voyager, puis on dessine un plan à ta mesure.' },
  { n: '02', titre: 'Soumission et plan', ligne: 'Un devis clair, sans surprise, avec les choix de matériaux et le calendrier.' },
  { n: '03', titre: 'Construction en atelier', ligne: "On bâtit ta van pièce par pièce, dans notre atelier, avec du vrai bois et du soin." },
  { n: '04', titre: 'Livraison et prise en main', ligne: 'On te remet les clés et on prend le temps de tout t’expliquer avant le départ.' },
]

export function Processus() {
  return (
    <section id="processus" className="relative bg-sapin-profond px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px]">
        <p className="flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-sarcelle uppercase">
          <span className="h-px w-8 bg-sarcelle/60" />
          Le processus
        </p>
        <h2 className="mt-4 max-w-[18ch] font-display text-4xl leading-none text-os uppercase md:text-6xl">
          De l&rsquo;idée à la route
        </h2>

        <Reveal className="mt-16 space-y-12 md:mt-24 md:space-y-6" stagger={0.14} y={30}>
          {ETAPES.map((e, i) => {
            const alignRight = i % 2 === 1
            return (
              <div key={e.n} className={`flex ${alignRight ? 'md:justify-end' : 'md:justify-start'}`}>
                <div
                  className={`group flex max-w-[54ch] items-start gap-6 border-t border-os/12 pt-8 transition-colors duration-300 hover:border-sarcelle/50 md:w-[64%] ${
                    alignRight ? 'md:flex-row-reverse md:text-right' : ''
                  }`}
                >
                  <span className="font-mono text-3xl leading-none text-sarcelle md:text-5xl">{e.n}</span>
                  <div>
                    <h3 className="font-display text-2xl text-os uppercase md:text-4xl">{e.titre}</h3>
                    <p className="mt-3 text-base leading-relaxed text-os/70">{e.ligne}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
