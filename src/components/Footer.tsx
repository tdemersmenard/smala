import { Logo } from './Logo'
import { EcrisNous } from './cta/EcrisNous'

export function Footer() {
  const annee = new Date().getFullYear()

  return (
    <footer className="topo relative overflow-hidden px-5 pt-24 pb-12 md:px-10">
      <div className="mx-auto max-w-[1400px]">
        <p className="max-w-[20ch] font-body text-base text-os/70">
          Une idée de van ? On part de zéro avec toi.
        </p>
        <div className="mt-6">
          <EcrisNous />
        </div>

        <div className="mt-24 flex flex-col gap-8 border-t border-os/12 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <Logo className="h-9" />
            <p className="font-mono text-xs tracking-wide text-os/50">Tribu Nomade · Ride Your Tribe</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-xs text-os/60">
            <a href="mailto:info@smalavans.ca" className="transition-colors hover:text-sarcelle">
              info@smalavans.ca
            </a>
            <a
              href="https://www.facebook.com/smalavans"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-sarcelle"
            >
              Facebook
            </a>
            <span>Québec</span>
            <span>© {annee} Smala Vans</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
