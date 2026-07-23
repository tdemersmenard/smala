import { useState } from 'react'
import { Monogram } from './Monogram'

type Props = {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

/**
 * Image avec repli tonal sapin élégant. Si le fichier est absent (le client ne
 * l'a pas encore déposé dans /public), on affiche un placeholder monochrome avec
 * le monogramme au lieu d'une image cassée.
 */
export function SmartImage({ src, alt, className, loading = 'lazy' }: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-sapin-profond ${className ?? ''}`}
        role="img"
        aria-label={alt}
      >
        <div className="topo absolute inset-0 opacity-40" aria-hidden="true" />
        <Monogram className="relative h-16 w-16 opacity-70" />
        <span className="sr-only">{alt}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
