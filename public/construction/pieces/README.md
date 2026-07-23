# Pièces qui tombent — Smala Vans

Chaque pièce est la **vraie partie ajoutée** à cette étape, découpée directement
des rendus `van/van-1..5.png` (le delta entre deux van consécutifs), clippée à
l'intérieur du cargo. Elle tombe du ciel et se **cale pile en place** sur la van
(alignement au pixel) : la van se construit vraiment, morceau par morceau.

- `isolation.png` — poste 1 : delta van-1 → van-2
- `filage.png` — poste 2 : delta van-2 → van-3
- `armoire.png` + `comptoir.png` — poste 3 : delta van-3 → van-4 (coupé haut/bas)
- `matelas.png` — poste 4 : delta van-4 → van-5

## Ne pas éditer à la main

Ces fichiers sont **générés**. Si tu remplaces les rendus `van/van-*.png`,
régénère-les :

```bash
cd public/construction
python3 ../../tools/generate-drops.py
```

Le script affiche les centroïdes (cx/cy) — reporte-les dans la constante `DROPS`
de `src/components/van/VanBuild.tsx` pour recentrer l'onde de choc d'impact.

Les anciens sprites AI (objets isolés) sont archivés dans
`../../../anciens_sprites_ai/`.
