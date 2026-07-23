type Props = {
  href?: string
  className?: string
  label?: string
}

/**
 * CTA primaire. Bloc rectangulaire à coins vifs, bordure 2px sarcelle, texte os.
 * Au survol : le remplissage sarcelle monte du bas (transform scaleY, origine
 * bas), le texte passe à l'encre. :active -> scale 0.98.
 */
export function DemanderSoumission({
  href = '#soumission',
  className = '',
  label = 'Demander une soumission',
}: Props) {
  return (
    <a
      href={href}
      className={`group relative inline-flex items-center justify-center overflow-hidden border-2 border-sarcelle px-7 py-3.5 transition-transform duration-150 active:scale-[0.98] ${className}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-sarcelle transition-transform duration-300 ease-out group-hover:scale-y-100"
      />
      <span className="relative font-mono text-sm tracking-wide text-os uppercase transition-colors duration-300 group-hover:text-encre">
        {label}
      </span>
    </a>
  )
}
