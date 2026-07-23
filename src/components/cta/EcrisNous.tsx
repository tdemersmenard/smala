type Props = {
  href?: string
  className?: string
  label?: string
}

/**
 * CTA du footer. Headline cliquable surdimensionnée dont le soulignement se
 * dessine de gauche à droite au survol (scaleX, origine gauche).
 */
export function EcrisNous({
  href = 'mailto:info@smalavans.ca',
  className = '',
  label = 'Écris-nous',
}: Props) {
  return (
    <a
      href={href}
      className={`group relative inline-block font-display text-6xl leading-none text-os uppercase sm:text-7xl md:text-8xl ${className}`}
    >
      {label}
      <span
        aria-hidden="true"
        className="absolute -bottom-2 left-0 h-1 w-full origin-left scale-x-0 bg-sarcelle transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:scale-x-100"
      />
    </a>
  )
}
