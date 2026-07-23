# Smala Vans — site vitrine

Site vitrine one-page pour **Smala · Tribu Nomade** : conversion de Mercedes
Sprinter en vans aménagées quatre saisons, faites au Québec. _Ride Your Tribe._

## Démarrer

```bash
npm install
npm run dev      # http://localhost:5173
```

Autres scripts : `npm run build` (typecheck + build), `npm run preview`.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS v4 (thème de marque dans `src/index.css`, bloc `@theme`)
- GSAP + ScrollTrigger (tout le motion) · Lenis (smooth scroll, ponté sur
  `gsap.ticker` dans `src/lib/useSmoothScroll.ts`)
- Pas de backend : le formulaire de soumission compose un `mailto:`

## Assets fournis par le client

Le code référence les fichiers avec un repli élégant s'ils sont absents :

- `public/construction/` — **la séquence héro** : 6 rendus 3D de la van en
  coupe (`etape-1.png` … `etape-6.png`) que le scroll crossfade.
- `public/realisations/` — photos des vans réalisées (`projet-1.jpg` …)
- `public/brand/` — logo, bannière, image OG

Tant qu'un fichier n'est pas déposé, un placeholder tonal sapin avec le
monogramme s'affiche. Aucune image cassée.

## Structure

- `src/components/van/VanBuild.tsx` — **la pièce maîtresse** : section épinglée
  (~500vh) où un stack de 6 images plein cadre se crossfade au scroll, avec
  micro-zoom continu, composition lettre par lettre de « RIDE YOUR TRIBE » et
  bascule du fond vers sapin-profond au payoff. Un seul timeline GSAP.
- `src/components/` — Nav, Hero, Manifeste, Réalisations (défilement
  horizontal épinglé), Processus, Soumission, Footer.
- `src/components/cta/` — chaque CTA a son propre chrome (aucun style partagé).

## Accessibilité

`prefers-reduced-motion` est respecté partout : aucune animation. La section
héro affiche alors l'image de la van finie, statique, avec les 5 chapitres en
flux normal. Le smooth scroll est aussi désactivé dans ce mode.
# smala
