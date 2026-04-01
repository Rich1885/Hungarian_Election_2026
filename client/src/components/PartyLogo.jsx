/**
 * Inline SVG party logos for Hungarian political parties
 * Premium Glass/Neon aesthetics for Dark Mode
 */

// TISZA – red & green infinity ribbon on white circle
function TiszaLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="tiszaBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="glow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#tiszaBg)" />
      {/* Vékony border */}
      <rect width="96" height="96" x="2" y="2" rx="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      
      <circle cx="50" cy="50" r="35" fill="white" filter="url(#glow)" />
      
      {/* Left loop (red/coral) */}
      <path
        d="M50 50 C50 38, 38 30, 28 36 C18 42, 18 58, 28 64 C38 70, 50 62, 50 50Z"
        fill="none" stroke="#f43f5e" strokeWidth="6.5" strokeLinecap="round" filter="url(#glow)"
      />
      {/* Right loop (green/teal) */}
      <path
        d="M50 50 C50 38, 62 30, 72 36 C82 42, 82 58, 72 64 C62 70, 50 62, 50 50Z"
        fill="none" stroke="#10b981" strokeWidth="6.5" strokeLinecap="round" filter="url(#glow)"
      />
      {/* Center crossing overlap - red passes over */}
      <path
        d="M46 46 C48 48, 52 52, 54 54"
        stroke="#f43f5e" strokeWidth="7" strokeLinecap="round"
      />
    </svg>
  );
}

// Fidesz – gradient orange background with FIDESZ text
function FideszLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="fideszBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <filter id="fGlow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#fideszBg)" />
      <rect width="96" height="96" x="2" y="2" rx="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <text x="50" y="55" textAnchor="middle" dominantBaseline="middle"
        fill="white" fontWeight="900" fontSize="24" fontFamily="Arial, sans-serif"
        letterSpacing="-0.5" filter="url(#fGlow)">FIDESZ</text>
    </svg>
  );
}

// DK – gradient blue circle with "dk"
function DKLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="dkBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <filter id="dkShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="rgba(0,0,0,0.4)" />
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#dkBg)" />
      <rect width="96" height="96" x="2" y="2" rx="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <circle cx="50" cy="50" r="32" fill="none" stroke="white" strokeWidth="4" filter="url(#dkShadow)" />
      <text x="50" y="54" textAnchor="middle" dominantBaseline="middle"
        fill="white" fontWeight="900" fontSize="30" fontFamily="Arial, sans-serif" filter="url(#dkShadow)">dk</text>
    </svg>
  );
}

// Momentum – stylized purple M
function MomentumLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="momBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="momGlow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(139,92,246,0.6)" />
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#momBg)" />
      <rect width="96" height="96" x="2" y="2" rx="20" fill="none" stroke="rgba(139,92,246,0.3)" strokeWidth="2" />
      <path
        d="M25 75 L25 40 L50 55 L75 40 L75 75"
        stroke="#8b5cf6" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" filter="url(#momGlow)"
      />
      <circle cx="50" cy="25" r="9" fill="#a78bfa" filter="url(#momGlow)" />
    </svg>
  );
}

// Mi Hazánk – green gradient with shield/cross
function MiHazankLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="mhBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <filter id="mhShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#mhBg)" />
      <rect width="96" height="96" x="2" y="2" rx="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      
      <path
        d="M50 18 C30 18, 22 30, 22 45 C22 65, 50 82, 50 82 C50 82, 78 65, 78 45 C78 30, 70 18, 50 18Z"
        fill="white" opacity="0.95" filter="url(#mhShadow)"
      />
      <path
        d="M50 28 C36 28, 30 37, 30 47 C30 62, 50 74, 50 74 C50 74, 70 62, 70 47 C70 37, 64 28, 50 28Z"
        fill="#15803d"
      />
      {/* Kereszt */}
      <rect x="46" y="34" width="8" height="30" rx="1.5" fill="white" />
      <rect x="38" y="42" width="24" height="8" rx="1.5" fill="white" />
    </svg>
  );
}

// MSZP – red rose / gradient red
function MSZPLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="mszpBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <filter id="mszpShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#mszpBg)" />
      <rect width="96" height="96" x="2" y="2" rx="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <text x="50" y="53" textAnchor="middle" dominantBaseline="middle"
        fill="white" fontWeight="900" fontSize="24" fontFamily="Arial, sans-serif"
        letterSpacing="1" filter="url(#mszpShadow)">MSZP</text>
      <rect x="25" y="65" width="50" height="3" rx="1.5" fill="white" opacity="0.8" filter="url(#mszpShadow)" />
    </svg>
  );
}

// LMP – green leaf
function LMPLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <defs>
        <linearGradient id="lmpBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <filter id="lmpShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.4)" />
        </filter>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#lmpBg)" />
      <rect width="96" height="96" x="2" y="2" rx="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <path
        d="M50 75 C50 75, 48 55, 35 40 C28 32, 25 28, 30 22 C35 16, 50 18, 55 25 C60 32, 65 32, 70 28 C75 24, 72 35, 65 45 C55 60, 50 75, 50 75Z"
        fill="white" opacity="0.95" filter="url(#lmpShadow)"
      />
      <path d="M50 75 C50 55, 48 45, 42 35" stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}


const LOGO_COMPONENTS = {
  'Fidesz': FideszLogo,
  'Tisza': TiszaLogo,
  'DK': DKLogo,
  'Momentum': MomentumLogo,
  'Mi Hazánk': MiHazankLogo,
  'MSZP-Párbeszéd': MSZPLogo,
  'LMP': LMPLogo,
};

// Mapping for alternative names (from Polymarket, etc.)
const NAME_ALIASES = {
  'Fidesz-KDNP': 'Fidesz',
  'TISZA': 'Tisza',
  'TISZA Párt': 'Tisza',
  'Mi Hazánk Mozgalom': 'Mi Hazánk',
  'Demokratikus Koalíció': 'DK',
  'Momentum Mozgalom': 'Momentum',
  'MSZP': 'MSZP-Párbeszéd',
  'Párbeszéd': 'MSZP-Párbeszéd',
  'LMP - Magyarország Zöld Pártja': 'LMP',
};

/**
 * PartyLogo component
 * @param {string} party - Party name (e.g., "Fidesz", "Tisza", "DK")
 * @param {number} size - Size in pixels (default: 24)
 * @param {string} className - Additional CSS classes
 */
export default function PartyLogo({ party, size = 24, className = "" }) {
  const normalized = NAME_ALIASES[party] || party;
  const LogoComponent = LOGO_COMPONENTS[normalized];

  if (!LogoComponent) {
    // Fallback: premium colored circle with first letter
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 text-white font-bold flex-shrink-0 border border-slate-600/50 shadow-inner ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(10, size * 0.45) }}
      >
        {(party || "?").charAt(0)}
      </div>
    );
  }

  return (
    <span className={`inline-flex flex-shrink-0 rounded-[22%] overflow-hidden bg-transparent ${className}`}>
      <LogoComponent size={size} />
    </span>
  );
}

/**
 * Get the canonical party name for lookups
 */
export function resolvePartyName(name) {
  return NAME_ALIASES[name] || name;
}