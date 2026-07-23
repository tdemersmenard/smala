import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { VanBuild } from './components/van/VanBuild'
import { Manifeste } from './components/Manifeste'
import { Atelier } from './components/Atelier'
import { Processus } from './components/Processus'
import { Soumission } from './components/Soumission'
import { Footer } from './components/Footer'
import { useSmoothScroll } from './lib/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <VanBuild />
        <Manifeste />
        <Atelier />
        <Processus />
        <Soumission />
      </main>
      <Footer />
    </>
  )
}
