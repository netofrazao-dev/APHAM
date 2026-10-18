import { site } from '../data/content'

// Logomarca oficial da APHAM (imagem em /public/midia/logo-apham.png).
// É só o visual — quem usa o Logo decide o link (normalmente um <Link to="/">).
export default function Logo({ className = 'h-12', withText = false, light = false }) {
  return (
    <span className="group inline-flex items-center gap-3">
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
    </span>
  )
}
