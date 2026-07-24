import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import { SmartImage } from '../SmartImage'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { getLenis } from '../../lib/lenis'

gsap.registerPlugin(ScrollTrigger, Observer)

const VANS = [1, 2, 3, 4, 5].map((n) => `/construction/van/van-${n}.png`)
const PIECE_BASE = '/construction/pieces/'
const PAYOFF = '/construction/etape-6.png'
const FALLBACK = '/construction/fallback.png'

/**
 * Pièces qui tombent du ciel à chaque poste. `lx`/`ly` = point d'atterrissage en
 * % du RIG (les pièces sont enfants du rig -> suivent la van). `t` = [début,
 * impact] en unités timeline. `strong` = impact renforcé.
 */
// Chaque pièce est la VRAIE partie ajoutée à cette étape, découpée du rendu
// van-N+1 (delta entre deux van) : un calque plein cadre qui tombe et se cale
// PILE en place sur la van (rotation/scale se résorbent vers 0/1 -> alignement).
// `cx`/`cy` = centroïde de la découpe (repère image) pour l'onde de choc.
type Drop = {
  src: string
  rot: number
  t: [number, number]
  cx: number
  cy: number
  strong?: boolean
  mobileSkip?: boolean
}

const DROPS: Drop[] = [
  { src: 'isolation.png', rot: -7, t: [11, 21], cx: 0.609, cy: 0.489 },
  { src: 'filage.png', rot: 7, t: [32, 42], cx: 0.61, cy: 0.492 },
  { src: 'armoire.png', rot: -6, t: [53, 61], cx: 0.641, cy: 0.374 },
  { src: 'comptoir.png', rot: 6, t: [59, 66], strong: true, cx: 0.587, cy: 0.606 },
  { src: 'matelas.png', rot: -6, t: [75, 84], mobileSkip: true, cx: 0.619, cy: 0.493 },
]

// from, to, at : crossfade van-(from+1) -> van-(to+1), calé au pic d'impact.
const VAN_CROSS = [
  [0, 1, 21],
  [1, 2, 42],
  [2, 3, 66],
  [3, 4, 84],
] as const

// Fenêtres de roulement (entrée + 3 trajets), en unités timeline.
const ROLL_WINS = [
  [0, 10],
  [24, 31],
  [45, 52],
  [68, 74],
] as const

const PARTICLES = Array.from({ length: 7 }, (_, i) => {
  const a = Math.PI + (Math.PI * (i + 0.5)) / 7
  return { ux: Math.cos(a), uy: Math.sin(a), dist: 40 + ((i * 53) % 50), rot: ((i * 67) % 90) - 45 }
})

const CHAPTERS = [
  { n: '01', title: 'La coquille', line: 'Chaque projet commence par une Sprinter vide et un plan précis.' },
  { n: '02', title: 'Isoler pour nos hivers', line: 'Isolation quatre saisons, pensée pour le climat du Québec.' },
  { n: '03', title: 'Les systèmes', line: 'Électricité, eau, chauffage : tout est intégré et fiable.' },
  { n: '04', title: "L'aménagement", line: 'Bambou, rangements intelligents, un vrai chez-vous compact.' },
  { n: '05', title: 'En route', line: 'Ta van est prête. Le reste appartient à ta tribu.' },
] as const

const WORDMARK = 'RIDE YOUR TRIBE'
// Bascule du chapitre actif (temps timeline) : pendant les roulements + payoff.
const CHAP_TIMES = [9, 28, 49, 90]

// Étapes discrètes : chaque geste de scroll amène la timeline d'un état "posé"
// au suivant (une pièce à la fois), peu importe la force du scroll. Temps
// (unités timeline) où la van est calée avec la nouvelle pièce en place.
// L'entrée de la section démarre à STEP_TIMES[0] ; la fin (payoff + mot-symbole)
// est ajoutée à l'exécution via tl.duration().
//  0: coquille en place · 1: isolation · 2: filage · 3: armoire+comptoir · 4: matelas
const STEP_TIMES = [10, 30, 51, 73, 88]

export function VanBuild() {
  const reduced = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useLayoutEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return

    const ctx = gsap.context(() => {}, root)
    let cancelled = false
    const dec = (img: HTMLImageElement) => (img.decode ? img.decode() : Promise.resolve())
    const vw = (n: number) => (n / 100) * window.innerWidth

    if (reduced) {
      setActive(CHAPTERS.length - 1)
      return () => {
        cancelled = true
        ctx.revert()
      }
    }

    const srcs = [...VANS, ...DROPS.map((d) => PIECE_BASE + d.src), PAYOFF]
    const preload = srcs.map((s) => {
      const img = new Image()
      img.src = s
      return img
    })
    // On sait quels sprites existent vraiment (matelas peut manquer).
    const loaded = new Set<string>()

    const build = () => {
      ctx.add(() => {
        const isMobile = window.matchMedia('(max-width: 1023px)').matches
        const vans = gsap.utils.toArray<HTMLElement>('.van-frame')
        const rig = root.querySelector<HTMLElement>('.van-rig')
        const scene = root.querySelector<HTMLElement>('.van-scene')
        const vanImgs = root.querySelector<HTMLElement>('.van-imgs')
        const bob = root.querySelector<HTMLElement>('.van-bob')
        const shadow = root.querySelector<HTMLElement>('.van-shadow')
        const payoffEl = root.querySelector<HTMLElement>('.van-payoff')
        const letters = gsap.utils.toArray<HTMLElement>('.wordmark-letter')
        const speedlines = gsap.utils.toArray<HTMLElement>('.speedline')
        if (!rig || !scene) return

        const P = isMobile ? [-42, -26, -10, 8] : [-18, -6, 7, 18]
        const ENTRY = isMobile ? -75 : -60
        const EXIT = isMobile ? 95 : 90

        // --- États initiaux.
        gsap.set(vans, { autoAlpha: 0 })
        gsap.set(vans[0], { autoAlpha: 1 })
        gsap.set(rig, { xPercent: -50, x: () => vw(ENTRY) })
        gsap.set(shadow, { scaleX: 1, opacity: 0.28 })
        gsap.set(payoffEl, { autoAlpha: 0 })
        gsap.set(letters, { autoAlpha: 0, y: 18 })
        gsap.set(scene, { x: 0 })
        // scaleX -1 : la van roule nez-en-avant vers la droite.
        gsap.set(vanImgs, { scaleX: -1, scaleY: 1, transformOrigin: '50% 100%' })

        // Respiration de la van (indépendante du scroll).
        if (bob) gsap.to(bob, { y: -2, rotation: 0.3, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })

        // Timeline en pause : elle n'est PLUS liée à la position du scroll. On la
        // pilote nous-mêmes, une étape par geste (voir le contrôleur plus bas).
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          paused: true,
          onUpdate: () => {
            const t = tl.time()
            let i = 0
            for (const ct of CHAP_TIMES) if (t >= ct) i++
            setActive(i)
          },
        })

        // --- La van roule : entrée puis d'un poste à l'autre, puis sortie.
        tl.to(rig, { x: () => vw(P[0]), ease: 'power2.out', duration: 10 }, 0)
        tl.to(rig, { x: () => vw(P[1]), ease: 'power2.inOut', duration: 7 }, 24)
        tl.to(rig, { x: () => vw(P[2]), ease: 'power2.inOut', duration: 7 }, 45)
        tl.to(rig, { x: () => vw(P[3]), ease: 'power2.inOut', duration: 6 }, 68)
        tl.to(rig, { x: () => vw(EXIT), ease: 'power2.in', duration: 14 }, 86)

        // Ombre : s'étire pendant les roulements, se resserre à l'arrêt.
        ROLL_WINS.forEach(([a, b]) => {
          const d = b - a
          tl.to(shadow, { scaleX: 1.35, opacity: 0.2, duration: d * 0.5, ease: 'power1.out' }, a)
          tl.to(shadow, { scaleX: 1, opacity: 0.28, duration: d * 0.5, ease: 'power1.in' }, a + d * 0.5)
          // Lignes de vitesse qui filent vers la gauche derrière la van.
          const lines = isMobile ? speedlines.slice(0, 2) : speedlines
          lines.forEach((ln, li) => {
            tl.fromTo(
              ln,
              { x: vw(8), opacity: 0 },
              { keyframes: { x: [vw(8), vw(-36)], opacity: [0, 0.32, 0.32, 0] }, duration: d, ease: 'none', immediateRender: false },
              a + li * 0.6,
            )
          })
        })

        // Dust : 2 poufs par roulement (éléments dédiés par fenêtre).
        ROLL_WINS.forEach(([a, b], ri) => {
          const d = b - a
          for (let j = 0; j < 2; j++) {
            const dust = root.querySelector<HTMLElement>(`[data-dust="${ri}-${j}"]`)
            if (!dust) continue
            gsap.set(dust, { xPercent: -50, yPercent: -50 })
            tl.fromTo(
              dust,
              { x: 0, y: 0, scale: 0.4, opacity: 0 },
              { x: vw(-5), y: vw(2.5), scale: 1.4, opacity: 0, keyframes: { opacity: [0, 0.5, 0] }, duration: d * 0.7, ease: 'power1.out', immediateRender: false },
              a + j * d * 0.35,
            )
          }
        })

        // --- Crossfades van-N -> van-N+1, calés au pic d'impact (doux et amples).
        VAN_CROSS.forEach(([from, to, at]) => {
          tl.to(vans[from], { autoAlpha: 0, duration: 7, ease: 'power1.inOut' }, at)
          tl.to(vans[to], { autoAlpha: 1, duration: 7, ease: 'power1.inOut' }, at)
        })

        // --- Les pièces tombent du ciel et frappent la van.
        DROPS.forEach((drop, di) => {
          if (!loaded.has(drop.src)) return // sprite absent (ex. matelas) -> sauté
          if (isMobile && drop.mobileSkip) return
          const el = root.querySelector<HTMLElement>(`[data-drop="${di}"]`)
          if (!el) return
          const [s, impactAt] = drop.t
          const fall = impactAt - s

          // Calque plein cadre : tombe d'en haut et se cale PILE sur la van
          // (rotation -> 0, scale -> 1 = alignement parfait avec le rendu).
          // CACHÉE (autoAlpha 0) et hors écran tant que sa chute n'a pas commencé,
          // sinon on la voit posée en haut avant de tomber.
          // Pas de flou animé (coûteux sur un grand PNG -> saccades). Descente
          // douce qui décélère à l'arrivée (ease-out) et se cale sur la van.
          gsap.set(el, {
            y: () => -window.innerHeight * 0.8,
            rotation: drop.rot,
            scale: 1.06,
            autoAlpha: 0,
            transformOrigin: '50% 50%',
          })
          tl.set(el, { autoAlpha: 1 }, s) // révélée au tout début de la chute
          tl.to(el, { y: 0, rotation: 0, scale: 1, ease: 'power2.inOut', duration: fall }, s)
          // Absorption : le crossfade vers van-N+1 montre déjà la pièce alignée.
          tl.to(el, { autoAlpha: 0, duration: 4, ease: 'power1.inOut' }, impactAt)

          // Impact : onde + particules (dans le rig -> suivent la van).
          const ring = root.querySelector<HTMLElement>(`[data-ring="${di}"]`)
          if (ring) {
            gsap.set(ring, { xPercent: -50, yPercent: -50, scale: 0.2, opacity: 0 })
            tl.fromTo(ring, { scale: 0.2, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 3, ease: 'power2.out', immediateRender: false }, impactAt)
          }
          PARTICLES.forEach((pt, pi) => {
            const p2 = root.querySelector<HTMLElement>(`[data-particle="${di}-${pi}"]`)
            if (!p2) return
            gsap.set(p2, { xPercent: -50, yPercent: -50, opacity: 0 })
            tl.fromTo(
              p2,
              { x: 0, y: 0, rotation: 0, opacity: 0.6 },
              { x: pt.ux * pt.dist, y: pt.uy * pt.dist, rotation: pt.rot, opacity: 0, duration: 3, ease: 'power2.out', immediateRender: false },
              impactAt,
            )
          })
          // Squash de la van + secousse (renforcée pour comptoir).
          const k = drop.strong ? 1.5 : 1
          if (vanImgs) {
            tl.fromTo(vanImgs, { y: 4 }, { y: 0, duration: 2, ease: 'power2.out' }, impactAt)
            tl.to(vanImgs, { keyframes: { scaleY: [1, 0.985 * (1 / k) + (1 - 1 / k), 1.006, 1] }, duration: 2, ease: 'power2.out' }, impactAt)
          }
          tl.to(scene, { keyframes: { x: [0, -3 * k, 2 * k, 0] }, duration: 1.6, ease: 'power2.out' }, impactAt)
        })

        // Moment de fierté quand la van est complète.
        tl.to(rig, { keyframes: { scale: [1, 1.03, 1] }, duration: 4, ease: 'power1.inOut' }, 82)

        // --- Payoff : l'image du lac fond par-dessus, « RIDE YOUR TRIBE ».
        tl.to(payoffEl, { autoAlpha: 1, duration: 8, ease: 'power2.inOut' }, 88)
        tl.to(letters, { autoAlpha: 1, y: 0, duration: 8, stagger: 0.4, ease: 'back.out(2)' }, 90)

        // ─────────────────────────────────────────────────────────────────────
        // Contrôleur "une étape par geste".
        //
        // On épingle la section, on gèle le scroll (Lenis), et chaque geste
        // (molette / trackpad / swipe / flèches) fait avancer la timeline d'UN
        // cran seulement — quelle que soit la force du scroll. Un verrou
        // `animating` ignore les gestes tant qu'un cran est en cours de lecture,
        // donc un swipe violent = une seule pièce posée.
        const steps = [...STEP_TIMES, tl.duration()]
        const lenis = getLenis()
        let index = 0
        let animating = false

        const goTo = (target: number) => {
          const clamped = Math.max(0, Math.min(steps.length - 1, target))
          if (clamped === index) return
          animating = true
          const from = tl.time()
          const to = steps[clamped]
          // Durée proportionnelle à la distance -> vitesse de lecture constante.
          const dur = gsap.utils.clamp(0.6, 1.4, Math.abs(to - from) / 22)
          index = clamped
          tl.tweenTo(to, { duration: dur, ease: 'power2.inOut', onComplete: () => (animating = false) })
        }

        // Aux extrémités, on rend la main au scroll natif pour continuer la page.
        const release = (dir: 1 | -1) => {
          observer.disable()
          const to = dir > 0 ? st.end + 2 : st.start - 2
          if (lenis) {
            lenis.start()
            lenis.scrollTo(to)
          } else {
            window.scrollTo({ top: to })
          }
        }

        const forward = () => {
          if (animating) return
          if (index >= steps.length - 1) release(1)
          else goTo(index + 1)
        }
        const backward = () => {
          if (animating) return
          if (index <= 0) release(-1)
          else goTo(index - 1)
        }

        const onKey = (e: KeyboardEvent) => {
          if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault()
            forward()
          } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault()
            backward()
          }
        }

        // Observer : capte molette + tactile. `onDown` = scroll vers le bas =
        // on avance (pose la pièce suivante) ; `onUp` = scroll vers le haut =
        // on recule d'un cran.
        const observer = Observer.create({
          target: window,
          type: 'wheel,touch',
          tolerance: 12,
          dragMinimum: 3,
          preventDefault: true,
          onDown: forward,
          onUp: backward,
        })
        observer.disable()

        const activate = (fromBottom: boolean) => {
          index = fromBottom ? steps.length - 1 : 0
          tl.time(steps[index])
          lenis?.stop()
          observer.enable()
          window.addEventListener('keydown', onKey)
        }
        const deactivate = () => {
          observer.disable()
          window.removeEventListener('keydown', onKey)
          // Invariant de sécurité : hors de la section, Lenis DOIT tourner,
          // sinon le scroll de toute la page reste gelé.
          lenis?.start()
        }

        const st = ScrollTrigger.create({
          trigger: stage,
          start: 'top top',
          end: '+=60%', // "réserve" de scroll pour l'épinglage ; sautée à la sortie
          pin: true,
          invalidateOnRefresh: true,
          onEnter: () => activate(false),
          onEnterBack: () => activate(true),
          onLeave: deactivate,
          onLeaveBack: deactivate,
          // Sur resize : les positions en vw() sont recalculées, on re-rend l'étape.
          onRefresh: () => {
            tl.invalidate()
            tl.time(steps[index])
          },
        })

        requestAnimationFrame(() => ScrollTrigger.refresh())
      })
    }

    // Décoder TOUTES les images (van, payoff, pièces) avant d'armer le pin :
    // évite les à-coups de premier affichage (décodage d'un gros PNG en plein
    // scroll). On note au passage quels sprites existent vraiment.
    Promise.all([
      ...VANS.map((_, i) => dec(preload[i]).catch(() => undefined)),
      dec(preload[preload.length - 1]).catch(() => undefined), // payoff
      ...DROPS.map((d, i) =>
        dec(preload[VANS.length + i])
          .then(() => loaded.add(d.src))
          .catch(() => undefined),
      ),
    ]).then(() => {
      if (!cancelled) build()
    })

    return () => {
      cancelled = true
      ctx.revert()
    }
  }, [reduced])

  return (
    <section id="build" ref={rootRef} className="relative" aria-label="La construction d'une van, étape par étape">
      <div
        ref={stageRef}
        className="topo relative flex min-h-dvh flex-col justify-end overflow-hidden lg:grid lg:grid-cols-[minmax(0,400px)_1fr] lg:items-start"
      >
        {reduced ? (
          <>
            <div className="order-1 px-4 pt-24 md:px-8 lg:order-2 lg:p-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden md:rounded-3xl">
                <SmartImage src={FALLBACK} alt="Van Smala finie" loading="eager" className="h-full w-full object-cover object-center" />
              </div>
            </div>
            <ol className="order-2 space-y-8 px-5 py-16 md:px-10 lg:order-1 lg:content-center lg:pt-28">
              {CHAPTERS.map((c) => (
                <li key={c.n} className="flex gap-4">
                  <span className="font-mono text-sm text-sarcelle">{c.n}</span>
                  <div>
                    <h3 className="font-display text-2xl text-os uppercase">{c.title}</h3>
                    <p className="mt-1 max-w-[42ch] text-os/75">{c.line}</p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <>
            {/* Scène : décor + van (cible de la secousse caméra). */}
            <div className="van-scene absolute inset-0 z-0">
              {/* Ligne de sol sur laquelle la van roule. */}
              <div className="absolute inset-x-0 top-[72%] h-px bg-sarcelle/25" aria-hidden="true" />

              {/* Rig de la van : posé sur la ligne de sol, roule en x. */}
              <div
                className="van-rig absolute left-1/2 aspect-[1376/768] w-[78vw] [--wheel:37.5vw] lg:w-[46vw] lg:[--wheel:22.1vw]"
                style={{ top: 'calc(72% - var(--wheel))' }}
              >
                {/* Lignes de vitesse (derrière la van). */}
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="speedline absolute h-px bg-sarcelle/40"
                    style={{ top: `${44 + i * 9}%`, left: '30%', width: '40%' }}
                    aria-hidden="true"
                  />
                ))}
                {/* Poussière aux roues. */}
                {ROLL_WINS.map((_, ri) =>
                  [0, 1].map((j) => (
                    <div
                      key={`${ri}-${j}`}
                      data-dust={`${ri}-${j}`}
                      className="absolute rounded-full bg-os/60 blur-[3px]"
                      style={{ left: '30%', top: '84%', width: 22, height: 22 }}
                      aria-hidden="true"
                    />
                  )),
                )}

                {/* Ombre portée elliptique. */}
                <div
                  className="van-shadow absolute bottom-[9%] left-1/2 h-[5%] w-[60%] -translate-x-1/2 rounded-[50%] bg-black/40 blur-md"
                  aria-hidden="true"
                />

                {/* La van (respire) + ses images empilées. */}
                <div className="van-bob absolute inset-0">
                  <div className="van-imgs absolute inset-0">
                    {VANS.map((src, i) => (
                      <img key={src} src={src} alt={i === 0 ? 'Van Mercedes Sprinter en construction' : ''} aria-hidden={i !== 0} className="van-frame absolute inset-0 h-full w-full object-contain" />
                    ))}
                  </div>
                </div>

                {/* Pièces = découpes plein cadre alignées sur la van (enfants du
                    rig, retournées comme la van). L'impact est au centroïde miroir. */}
                {DROPS.map((d, di) => {
                  const ringX = (1 - d.cx) * 100
                  const ringY = d.cy * 100
                  return (
                    <div key={d.src}>
                      <div className="absolute inset-0 -scale-x-100" aria-hidden="true">
                        <img
                          data-drop={di}
                          src={PIECE_BASE + d.src}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                          style={{ willChange: 'transform, opacity' }}
                          className="absolute inset-0 h-full w-full object-contain opacity-0 select-none"
                        />
                      </div>
                      <div
                        data-ring={di}
                        style={{ position: 'absolute', left: `${ringX}%`, top: `${ringY}%`, width: 52, height: 52, willChange: 'transform, opacity' }}
                        className="rounded-full border-2 border-sarcelle opacity-0"
                      />
                      {PARTICLES.map((_, pi) => (
                        <span
                          key={pi}
                          data-particle={`${di}-${pi}`}
                          style={{ position: 'absolute', left: `${ringX}%`, top: `${ringY}%`, width: 4 + (pi % 3), height: 4 + (pi % 3), willChange: 'transform, opacity' }}
                          className={`${pi % 2 ? 'bg-os' : 'bg-sarcelle'} opacity-0`}
                        />
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payoff plein écran (van finie au lac). */}
            <img src={PAYOFF} alt="Van Smala finie au bord d'un lac au coucher du soleil" className="van-payoff absolute inset-0 z-20 h-full w-full -scale-x-100 object-cover object-center opacity-0" />

            {/* Mot-symbole, par-dessus le lac. */}
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 flex-wrap items-center justify-center gap-x-4 px-6" aria-label={WORDMARK}>
              {WORDMARK.split(' ').map((word, wi) => (
                <span key={wi} className="flex">
                  {word.split('').map((ch, ci) => (
                    <span key={ci} className="wordmark-letter font-display text-4xl text-os uppercase drop-shadow-[0_2px_12px_rgba(10,59,55,0.85)] md:text-6xl lg:text-7xl" aria-hidden="true">
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </div>

            {/* Colonne texte + rail. */}
            <div className="relative z-30 px-5 pt-24 pb-14 md:px-10 lg:pt-28 lg:pl-10">
              <div className="flex items-start gap-6">
                <ol className="hidden shrink-0 flex-col gap-4 pt-2 lg:flex" aria-hidden="true">
                  {CHAPTERS.map((c, i) => (
                    <li key={c.n} className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full transition-colors duration-300 ${i === active ? 'bg-sarcelle' : 'bg-os/25'}`} />
                      <span className={`font-mono text-xs transition-colors duration-300 ${i === active ? 'text-sarcelle' : 'text-os/30'}`}>{c.n}</span>
                    </li>
                  ))}
                </ol>
                <div className="relative min-h-[150px] flex-1">
                  {CHAPTERS.map((c, i) => (
                    <div
                      key={c.n}
                      aria-hidden={i !== active}
                      className={`transition-all duration-500 ease-out ${i === active ? 'relative translate-y-0 opacity-100' : 'pointer-events-none absolute inset-0 -translate-y-3 opacity-0'}`}
                    >
                      <span className="font-mono text-sm text-sarcelle lg:hidden">{c.n}</span>
                      <h3 className="mt-1 font-display text-3xl text-os uppercase md:text-4xl">{c.title}</h3>
                      <p className="mt-3 max-w-[40ch] text-os/80">{c.line}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
