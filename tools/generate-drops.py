#!/usr/bin/env python3
"""
Génère les pièces qui tombent au héro à partir des rendus `van/van-1..5.png`.
Chaque pièce = la VRAIE partie ajoutée à cette étape (delta entre deux van
consécutifs), découpée avec transparence et clippée à l'intérieur du cargo
(exclut cab, capot, roues -> pas de fantôme). Elle tombe et se cale PILE sur la
van dans le composant (alignement au pixel).

Relancer si tu remplaces les rendus van-* :
    cd public/construction && python3 ../../tools/generate-drops.py
Nécessite : Pillow, numpy

Le script affiche les centroïdes (cx, cy) de chaque découpe -> reporte-les dans
`src/components/van/VanBuild.tsx` (constante DROPS) pour centrer l'onde de choc.
"""
from PIL import Image, ImageFilter
import numpy as np

def load(i): return np.asarray(Image.open(f'van/van-{i}.png').convert('RGBA')).astype(np.int16)
v = {i: load(i) for i in range(1, 6)}
H, W = v[1].shape[:2]

# Fenêtre "intérieur du cargo" : où se passent tous les ajouts.
INT = np.zeros((H, W), bool)
INT[int(0.28 * H):int(0.75 * H), int(0.43 * W):int(0.88 * W)] = True

def dmask(a, b):
    rgbd = np.abs(a[..., :3] - b[..., :3]).sum(axis=2)
    return (b[..., 3] > 100) & ((a[..., 3] < 100) | (rgbd > 45)) & INT

def save_cut(b, mask, name):
    mm = Image.fromarray((mask * 255).astype(np.uint8))
    mm = mm.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(2.0))
    alpha = np.asarray(mm)
    Image.fromarray(np.dstack([b[..., :3].astype(np.uint8), alpha]).astype(np.uint8)).save(f'pieces/{name}.png')
    ys, xs = np.where(alpha > 60)
    print(f'  {name}: cx={xs.mean()/W:.3f} cy={ys.mean()/H:.3f}')

for a, b, name in [(1, 2, 'isolation'), (2, 3, 'filage'), (4, 5, 'matelas')]:
    save_cut(v[b], dmask(v[a], v[b]), name)
# aménagement (van3->4) coupé en deux : armoire (haut) + comptoir (bas)
m34 = dmask(v[3], v[4]); ys, _ = np.where(m34); ymid = int(np.median(ys))
top = m34.copy(); top[ymid:, :] = False
bot = m34.copy(); bot[:ymid, :] = False
save_cut(v[4], top, 'armoire')
save_cut(v[4], bot, 'comptoir')
print('OK')
