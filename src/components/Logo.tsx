import { useState } from 'react'

type Props = { className?: string }

/**
 * Logo officiel Smala (icône montagne-A + mot-symbole SMALA). PNG transparent,
 * pensé pour les fonds sombres (nav, footer). Repli texte si le fichier manque.
 */
export function Logo({ className = 'h-8' }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span className={`font-display text-2xl tracking-tight text-os uppercase ${className}`}>
        Smala
      </span>
    )
  }

  return (
    <img
      src="/brand/logo_smala.png"
      alt="Smala · Tribu Nomade"
      onError={() => setFailed(true)}
      className={`w-auto object-contain ${className}`}
    />
  )
}
