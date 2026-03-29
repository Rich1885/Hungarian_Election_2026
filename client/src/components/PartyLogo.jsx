/**
 * Inline SVG party logos for Hungarian political parties
 * Clean, scalable, no external dependencies
 */

// TISZA – red & green infinity ribbon on white circle
function TiszaLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" rx="18" fill="#1a2744" />
      <circle cx="50" cy="50" r="40" fill="white" />
      {/* Left loop (red/coral) */}
      <path
        d="M50 50 C50 38, 38 28, 28 35 C18 42, 18 58, 28 65 C38 72, 50 62, 50 50Z"
        fill="none" stroke="#e8485c" strokeWidth="6" strokeLinecap="round"
      />
      {/* Right loop (green/teal) */}
      <path
        d="M50 50 C50 38, 62 28, 72 35 C82 42, 82 58, 72 65 C62 72, 50 62, 50 50Z"
        fill="none" stroke="#2ab880" strokeWidth="6" strokeLinecap="round"
      />
      {/* Center crossing overlap - red passes over */}
      <path
        d="M46 46 C48 48, 52 52, 54 54"
        stroke="#e8485c" strokeWidth="6" strokeLinecap="round"
      />
    </svg>
  );
}

// Fidesz – orange background with FIDESZ text
function FideszLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" rx="18" fill="#f97316" />
      <text x="50" y="58" textAnchor="middle" dominantBaseline="middle"
        fill="white" fontWeight="900" fontSize="26" fontFamily="Arial, sans-serif"
        letterSpacing="-1">FIDESZ</text>
    </svg>
  );
}

// DK – blue circle with "dk"
function DKLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" rx="18" fill="#1d4ed8" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="white" strokeWidth="4" />
      <text x="50" y="56" textAnchor="middle" dominantBaseline="middle"
        fill="white" fontWeight="800" fontSize="32" fontFamily="Arial, sans-serif">dk</text>
    </svg>
  );
}

// Momentum – stylized green person/M
function MomentumLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" rx="18" fill="#1a1a2e" />
      <path
        d="M30 75 L30 40 L50 55 L70 40 L70 75"
        stroke="#7c3aed" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx="50" cy="28" r="8" fill="#7c3aed" />
    </svg>
  );
}

// Mi Hazánk – green with shield/cross
function MiHazankLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" rx="18" fill="#166534" />
      <path
        d="M50 18 C30 18, 22 30, 22 45 C22 65, 50 82, 50 82 C50 82, 78 65, 78 45 C78 30, 70 18, 50 18Z"
        fill="white" opacity="0.9"
      />
      <path
        d="M50 28 C36 28, 30 37, 30 47 C30 62, 50 74, 50 74 C50 74, 70 62, 70 47 C70 37, 64 28, 50 28Z"
        fill="#166534"
      />
      <rect x="46" y="34" width="8" height="30" rx="2" fill="white" />
      <rect x="38" y="42" width="24" height="8" rx="2" fill="white" />
    </svg>
  );
}

// MSZP – red rose
function MSZPLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" rx="18" fill="#dc2626" />
      <text x="50" y="56" textAnchor="middle" dominantBaseline="middle"
        fill="white" fontWeight="900" fontSize="24" fontFamily="Arial, sans-serif"
        letterSpacing="1">MSZP</text>
      <rect x="20" y="68" width="60" height="3" rx="1.5" fill="white" opacity="0.6" />
    </svg>
  );
}

// LMP – green leaf
function LMPLogo({ size }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <rect width="100" height="100" rx="18" fill="#15803d" />
      <path
        d="M50 75 C50 75, 48 55, 35 40 C28 32, 25 28, 30 22 C35 16, 50 18, 55 25 C60 32, 65 32, 70 28 C75 24, 72 35, 65 45 C55 60, 50 75, 50 75Z"
        fill="white" opacity="0.9"
      />
      <path d="M50 75 C50 55, 48 45, 42 35" stroke="#15803d" strokeWidth="3" fill="none" strokeLinecap="round" />
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
    // Fallback: colored circle with first letter
    return (
      <div
        className={`inline-flex items-center justify-center rounded-md bg-slate-700 text-white text-[10px] font-bold flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        {(party || "?").charAt(0)}
      </div>
    );
  }

  return (
    <span className={`inline-flex flex-shrink-0 rounded-md overflow-hidden ${className}`}>
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
