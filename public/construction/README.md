# Assets du héro « la van voyageuse » — Smala Vans

Le héro met en scène une van détourée qui entre par la gauche, roule vers la
droite en s'arrêtant à 4 postes d'assemblage (où des pièces tombent du ciel et
la transforment), puis le paysage s'ouvre au lac.

## Fichiers

- `van/van-1.png` … `van/van-5.png` — la van détourée (PNG transparents) aux 5
  états : coquille vide → isolée → systèmes → aménagée → finie. Toutes cadrées
  identiquement (van à x 12–88 %, roues à y 86 %), même caméra.
- `pieces/*.png` — les pièces détachées qui tombent (voir `pieces/README.md`).
- `etape-6.png` — le payoff plein écran (van finie au bord d'un lac).
- `fallback.png` — image statique affichée en `prefers-reduced-motion`.

## Remplacer un asset

Garde le même cadrage pour les `van-*` (même van, même caméra) sinon les
crossfades et l'alignement des pièces sauteront. Les anciens rendus studio
`etape-1..5` (non détourés) sont archivés dans `../../anciens_rendus_etapes/`.
