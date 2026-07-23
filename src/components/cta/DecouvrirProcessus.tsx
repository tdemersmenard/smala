type Props = {
  href?: string
  className?: string
  label?: string
}

/**
 * CTA secondaire du hero. Lien inline souligné par un petit tracé topographique
 * SVG qui ondule au survol (stroke-dashoffset + translation, jamais opacity au
 * repos).
 */
export function DecouvrirProcessus({
  href = '#processus',
  className = '',
  label = 'Découvrir le processus',
}: Props) {
  return (
    <a
      href={href}
      className={`group inline-flex flex-col items-start gap-1 text-os transition-colors hover:text-sarcelle ${className}`}
    >
      <span className="font-body text-base">{label}</span>
      <svg
        viewBox="0 0 120 8"
        className="h-2 w-[120px]"
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="none"
      >
        <path
          d="M0 4 Q 15 0 30 4 T 60 4 T 90 4 T 120 4"
          stroke="var(--color-sarcelle)"
          strokeWidth="1.5"
          className="[stroke-dasharray:8_120] [stroke-dashoffset:0] transition-[stroke-dashoffset,transform] duration-500 ease-out group-hover:[stroke-dashoffset:-128] motion-reduce:transition-none"
        />
      </svg>
    </a>
  )
}
