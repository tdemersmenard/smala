import type Lenis from 'lenis'

/**
 * Petit singleton pour partager l'instance Lenis créée par `useSmoothScroll`.
 * `VanBuild` en a besoin pour geler le scroll natif pendant qu'il pilote sa
 * séquence pièce par pièce (sinon Lenis continuerait de faire défiler la page
 * par-dessus la prise en main par Observer).
 */
let instance: Lenis | null = null

export function setLenis(l: Lenis | null): void {
  instance = l
}

export function getLenis(): Lenis | null {
  return instance
}
