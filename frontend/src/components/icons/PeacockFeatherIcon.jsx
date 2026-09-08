import * as React from "react"

export function PeacockFeatherIcon({ className = "size-8" }) {
  const rawId = React.useId()
  const id = rawId.replace(/:/g, "")
  const plumeGrad = `feather-plume-${id}`
  const goldGrad = `feather-gold-${id}`
  const cyanGrad = `feather-cyan-${id}`
  const blueGrad = `feather-blue-${id}`
  const glowGrad = `feather-glow-${id}`

  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Divine Aura Glow */}
        <radialGradient id={glowGrad} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </radialGradient>

        {/* Emerald to Forest Green Plume */}
        <linearGradient id={plumeGrad} x1="6" y1="4" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="30%" stopColor="#10B981" />
          <stop offset="70%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Radiant Golden Saffron Eye Ring */}
        <linearGradient id={goldGrad} x1="10" y1="6" x2="26" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="45%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Luminous Peacock Cyan Ring */}
        <linearGradient id={cyanGrad} x1="12" y1="8" x2="24" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67E8F9" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Deep Divine Krishna Indigo / Royal Blue Heart */}
        <linearGradient id={blueGrad} x1="14" y1="10" x2="22" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="45%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* Subtle Divine Aura */}
      <circle cx="18" cy="15" r="16" fill={`url(#${glowGrad})`} />

      {/* Outer Feather Plume with Natural Taper */}
      <path
        d="M18 3.5C22.5 3.8 29.5 7.5 30 14.5C30.5 19.5 27 24 23 27C21 28.5 19.5 30 18 33C16.5 30 15 28.5 13 27C9 24 5.5 19.5 6 14.5C6.5 7.5 13.5 3.8 18 3.5Z"
        fill={`url(#${plumeGrad})`}
      />

      {/* Feather Barb Strands (Left & Right Fringes) */}
      <path
        d="M6.5 11C9 12.5 13 13.5 17.5 14M29.5 11C27 12.5 23 13.5 18.5 14M5.5 15C8.5 16 13 16.5 17.5 17M30.5 15C27.5 16 23 16.5 18.5 17M6.8 19C9.5 20 13.5 20.5 17.5 20.5M29.2 19C26.5 20 22.5 20.5 18.5 20.5M9 23C11.5 24 14.5 24.5 17.5 24.5M27 23C24.5 24 21.5 24.5 18.5 24.5M12 27C14 28 16 28.5 17.5 28.5M24 27C22 28 20 28.5 18.5 28.5"
        stroke="#34D399"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.65"
      />

      {/* Wispy Crown Filaments on top */}
      <path
        d="M18 3.5C16.5 1.5 14.5 0.8 12.5 1.2M18 3.5C18.8 1.2 20 0.5 21.5 1M18 3.5C20.5 1.8 23 2.2 24.5 3.2"
        stroke="#10B981"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Outer Golden Bronze Eye (Ocellus) */}
      <ellipse
        cx="18"
        cy="14.5"
        rx="8"
        ry="8.8"
        fill={`url(#${goldGrad})`}
      />

      {/* Turquoise / Cyan Ring */}
      <ellipse
        cx="18"
        cy="14.8"
        rx="5.8"
        ry="6.5"
        fill={`url(#${cyanGrad})`}
      />

      {/* Deep Royal Krishna Blue Core Heart / Kidney Shape */}
      <path
        d="M18 10.8C20.8 10.8 22.8 12.4 22.4 15C22 17.4 20 19.2 18 19.6C16 19.2 14 17.4 13.6 15C13.2 12.4 15.2 10.8 18 10.8Z"
        fill={`url(#${blueGrad})`}
      />

      {/* Inner Celestial Sparkle / Highlight */}
      <circle cx="18" cy="14.5" r="1.8" fill="#93C5FD" />
      <circle cx="18.7" cy="13.7" r="0.7" fill="#FFFFFF" />

      {/* Central Shaft / Quill running down */}
      <path
        d="M18 3.5C18.1 11 18.2 23 17.5 33.5"
        stroke="#F8FAFC"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );
}

export default PeacockFeatherIcon;
