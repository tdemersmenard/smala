type Props = {
  className?: string
  /** Couleur du tracé (défaut : sarcelle). */
  stroke?: string
  title?: string
}

/** Monogramme Smala : le A stylisé dans un cercle. */
export function Monogram({ className, stroke = 'var(--color-sarcelle)', title = 'Smala' }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <circle cx="32" cy="32" r="24" stroke={stroke} strokeWidth="2.5" />
      <path
        d="M32 17 L44 47 M32 17 L20 47 M24.5 38 L39.5 38"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
