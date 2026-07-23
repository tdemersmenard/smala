import { useState, type FormEvent } from 'react'
import { SmartImage } from './SmartImage'

type Errors = Partial<Record<'nom' | 'courriel' | 'message', string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function Soumission() {
  const [nom, setNom] = useState('')
  const [courriel, setCourriel] = useState('')
  const [modele, setModele] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})

  const validate = (): Errors => {
    const e: Errors = {}
    if (!nom.trim()) e.nom = 'On aimerait savoir à qui on parle.'
    if (!courriel.trim()) e.courriel = 'Il nous faut une adresse pour te répondre.'
    else if (!EMAIL_RE.test(courriel)) e.courriel = 'Ce courriel semble incomplet.'
    if (!message.trim()) e.message = 'Dis-nous deux mots sur ton projet.'
    return e
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    const sujet = `Demande de soumission — ${nom}`
    const corps = [
      `Nom : ${nom}`,
      `Courriel : ${courriel}`,
      `Modèle de van visé : ${modele || 'Non précisé'}`,
      '',
      'Projet :',
      message,
    ].join('\n')

    window.location.href = `mailto:info@smalavans.ca?subject=${encodeURIComponent(
      sujet,
    )}&body=${encodeURIComponent(corps)}`
  }

  const fieldClass =
    'w-full border-b border-os/25 bg-transparent py-3 text-os placeholder:text-os/35 outline-none transition-colors focus:border-sarcelle'

  return (
    <section id="soumission" className="relative bg-sapin px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1400px] gap-14 md:grid-cols-2 md:gap-20">
        {/* Gauche : invitation + coordonnées */}
        <div>
          <p className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-sarcelle uppercase">
            <span className="h-px w-8 bg-sarcelle/60" />
            Soumission
          </p>
          <h2 className="max-w-[14ch] font-display text-4xl leading-none text-os uppercase md:text-6xl">
            Parle-nous de ton projet
          </h2>
          <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-os/75">
            Une idée de van en tête, ou juste envie de jaser du possible ? Écris-nous, on
            répond à chaque message.
          </p>

          {/* Vraie van finie : ancre la confiance à côté du formulaire. */}
          <div className="mt-10 aspect-[16/10] w-full overflow-hidden border border-os/10">
            <SmartImage
              src="/photos/van-auvent.jpg"
              alt="Van Smala finie, auvent déployé"
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="font-mono text-xs tracking-wide text-sarcelle uppercase">Courriel</dt>
              <dd className="mt-1">
                <a href="mailto:info@smalavans.ca" className="text-lg text-os transition-colors hover:text-sarcelle">
                  info@smalavans.ca
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs tracking-wide text-sarcelle uppercase">Région</dt>
              <dd className="mt-1 text-lg text-os">Québec</dd>
            </div>
            <div>
              <dt className="font-mono text-xs tracking-wide text-sarcelle uppercase">Facebook</dt>
              <dd className="mt-1">
                <a
                  href="https://www.facebook.com/smalavans"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg text-os transition-colors hover:text-sarcelle"
                >
                  Page Smala Vans
                </a>
              </dd>
            </div>
          </dl>
        </div>

        {/* Droite : formulaire (labels au-dessus, focus ring sarcelle) */}
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-7">
          <div>
            <label htmlFor="nom" className="mb-1 block font-mono text-xs tracking-wide text-os/80 uppercase">
              Nom
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ton nom"
              className={fieldClass}
              aria-invalid={!!errors.nom}
            />
            {errors.nom && <p className="mt-2 text-sm text-sarcelle">{errors.nom}</p>}
          </div>

          <div>
            <label htmlFor="courriel" className="mb-1 block font-mono text-xs tracking-wide text-os/80 uppercase">
              Courriel
            </label>
            <input
              id="courriel"
              type="email"
              value={courriel}
              onChange={(e) => setCourriel(e.target.value)}
              placeholder="toi@exemple.ca"
              className={fieldClass}
              aria-invalid={!!errors.courriel}
            />
            {errors.courriel && <p className="mt-2 text-sm text-sarcelle">{errors.courriel}</p>}
          </div>

          <div>
            <label htmlFor="modele" className="mb-1 block font-mono text-xs tracking-wide text-os/80 uppercase">
              Modèle de van visé
            </label>
            <input
              id="modele"
              type="text"
              value={modele}
              onChange={(e) => setModele(e.target.value)}
              placeholder="Sprinter 170, 144, pas encore décidé…"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block font-mono text-xs tracking-wide text-os/80 uppercase">
              Ton projet
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Comment tu comptes voyager, ce que tu as en tête…"
              rows={4}
              className={`${fieldClass} resize-none`}
              aria-invalid={!!errors.message}
            />
            {errors.message && <p className="mt-2 text-sm text-sarcelle">{errors.message}</p>}
          </div>

          {/* Bouton d'envoi : chrome propre, coins vifs, remplissage qui monte. */}
          <button
            type="submit"
            className="group relative mt-2 inline-flex items-center justify-center overflow-hidden border-2 border-sarcelle px-7 py-3.5 active:scale-[0.98]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-bottom scale-y-0 bg-sarcelle transition-transform duration-300 ease-out group-hover:scale-y-100"
            />
            <span className="relative font-mono text-sm tracking-wide text-os uppercase transition-colors duration-300 group-hover:text-encre">
              Envoyer ma demande
            </span>
          </button>
        </form>
      </div>
    </section>
  )
}
