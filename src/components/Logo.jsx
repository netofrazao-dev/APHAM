import { site } from '../data/content'

// Logomarca oficial da APHAM (imagem em /public/midia/logo-apham.png).
export default function Logo({ className = 'h-12', withText = false, light = false }) {
  return (
    <a href="#inicio" className="group inline-flex items-center gap-3" aria-label={`${site.nome} — início`}>
      <img
        src="/midia/logo-apham.png"
        alt={site.nomeCompleto}
        className={`${className} w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
          light ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]' : ''
        }`}
      />
      {withText && (
        <span className={`hidden font-display text-lg font-extrabold sm:block ${light ? 'text-white' : 'text-navy-800'}`}>
          {site.nome}
        </span>
      )}
    </a>
  )
}
