// Faixa decorativa com grafismo geométrico inspirado na arte marajoara.
export default function MarajoaraBand({ className = '', color = '#1d6a42' }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        className="h-full w-full"
        viewBox="0 0 120 16"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="marajoara" width="24" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 16 L6 4 L12 16 Z" fill={color} opacity="0.9" />
            <path d="M12 16 L18 4 L24 16 Z" fill={color} opacity="0.5" />
            <path d="M6 4 L12 0 L18 4 L12 8 Z" fill={color} opacity="0.7" />
          </pattern>
        </defs>
        <rect width="120" height="16" fill="url(#marajoara)" />
      </svg>
    </div>
  )
}
