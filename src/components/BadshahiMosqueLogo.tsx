import React from "react";

interface BadshahiMosqueLogoProps {
  className?: string;
  size?: number;
}

export const BadshahiMosqueLogo: React.FC<BadshahiMosqueLogoProps> = ({
  className = "w-7 h-7",
  size
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-label="Badshahi Mosque Pakistan Architectural Logo"
    >
      <defs>
        {/* White Marble Domes with Soft Shading */}
        <linearGradient id="marbleDomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Lahore Red Sandstone Gradient */}
        <linearGradient id="sandstoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FB923C" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>

        {/* Mughal Architectural Gold Inlay */}
        <linearGradient id="goldFinialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>

        {/* Deep Archway Void Shadow */}
        <linearGradient id="iwanShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      {/* Courtyard Plinth Platform (Base) */}
      <rect x="4" y="56" width="56" height="4" rx="1.5" fill="url(#sandstoneGrad)" />
      <rect x="6" y="54" width="52" height="2.5" fill="#F97316" opacity="0.9" />

      {/* Main Sanctuary Red Sandstone Facade */}
      <rect x="12" y="36" width="40" height="19" rx="1" fill="url(#sandstoneGrad)" />

      {/* ================= LEFT MINARET ================= */}
      <g id="left-minaret">
        {/* Base Tier */}
        <path d="M 5 57 L 9 57 L 8.5 47 L 5.5 47 Z" fill="#9A3412" />
        {/* Tier 1 Balcony */}
        <rect x="4.5" y="46" width="5" height="1.5" rx="0.5" fill="url(#goldFinialGrad)" />
        {/* Tier 2 Shaft */}
        <path d="M 5.5 46 L 8.5 46 L 8 35 L 6 35 Z" fill="#C2410C" />
        {/* Tier 2 Balcony */}
        <rect x="5" y="34" width="4" height="1.5" rx="0.5" fill="url(#goldFinialGrad)" />
        {/* Tier 3 Shaft */}
        <path d="M 6 34 L 8 34 L 7.8 22 L 6.2 22 Z" fill="#9A3412" />
        {/* Top Balcony */}
        <rect x="5" y="21" width="4" height="1.5" rx="0.5" fill="url(#goldFinialGrad)" />
        {/* Open Pavilion / Chhatri Pillars */}
        <rect x="5.5" y="17" width="0.8" height="4.5" fill="#7C2D12" />
        <rect x="7.7" y="17" width="0.8" height="4.5" fill="#7C2D12" />
        {/* Minaret Chhatri Dome */}
        <path d="M 5 17 C 5 13.5, 7 11.5, 7 10 C 7 11.5, 9 13.5, 9 17 Z" fill="url(#marbleDomeGrad)" />
        {/* Golden Pinnacle */}
        <line x1="7" y1="10" x2="7" y2="7" stroke="url(#goldFinialGrad)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="7" cy="6.5" r="0.8" fill="#FDE047" />
      </g>

      {/* ================= RIGHT MINARET ================= */}
      <g id="right-minaret">
        {/* Base Tier */}
        <path d="M 55 57 L 59 57 L 58.5 47 L 55.5 47 Z" fill="#9A3412" />
        {/* Tier 1 Balcony */}
        <rect x="54.5" y="46" width="5" height="1.5" rx="0.5" fill="url(#goldFinialGrad)" />
        {/* Tier 2 Shaft */}
        <path d="M 55.5 46 L 58.5 46 L 58 35 L 56 35 Z" fill="#C2410C" />
        {/* Tier 2 Balcony */}
        <rect x="55" y="34" width="4" height="1.5" rx="0.5" fill="url(#goldFinialGrad)" />
        {/* Tier 3 Shaft */}
        <path d="M 56 34 L 58 34 L 57.8 22 L 56.2 22 Z" fill="#9A3412" />
        {/* Top Balcony */}
        <rect x="55" y="21" width="4" height="1.5" rx="0.5" fill="url(#goldFinialGrad)" />
        {/* Open Pavilion / Chhatri Pillars */}
        <rect x="55.5" y="17" width="0.8" height="4.5" fill="#7C2D12" />
        <rect x="57.7" y="17" width="0.8" height="4.5" fill="#7C2D12" />
        {/* Minaret Chhatri Dome */}
        <path d="M 55 17 C 55 13.5, 57 11.5, 57 10 C 57 11.5, 59 13.5, 59 17 Z" fill="url(#marbleDomeGrad)" />
        {/* Golden Pinnacle */}
        <line x1="57" y1="10" x2="57" y2="7" stroke="url(#goldFinialGrad)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="57" cy="6.5" r="0.8" fill="#FDE047" />
      </g>

      {/* ================= LEFT FLANKING DOME ================= */}
      <g id="left-dome">
        {/* Marble Drum */}
        <rect x="14.5" y="31" width="9" height="3.5" rx="0.5" fill="#E2E8F0" />
        {/* Bulbous Onion Dome */}
        <path
          d="M 15 31 
             C 12.5 28.5, 12 24.5, 14.5 20.5 
             C 16 18.5, 18.5 17.5, 19 15.5 
             C 19.5 17.5, 22 18.5, 23.5 20.5 
             C 26 24.5, 25.5 28.5, 23 31 
             Z"
          fill="url(#marbleDomeGrad)"
          stroke="#CBD5E1"
          strokeWidth="0.5"
        />
        {/* Fluting Ridges */}
        <path d="M 19 15.5 Q 17.5 23 17 31" stroke="#94A3B8" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M 19 15.5 Q 20.5 23 21 31" stroke="#94A3B8" strokeWidth="0.4" fill="none" opacity="0.6" />
        {/* Golden Finial (Kalasa) */}
        <line x1="19" y1="15.5" x2="19" y2="12" stroke="url(#goldFinialGrad)" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="19" cy="11.5" r="0.75" fill="#FDE047" />
      </g>

      {/* ================= RIGHT FLANKING DOME ================= */}
      <g id="right-dome">
        {/* Marble Drum */}
        <rect x="40.5" y="31" width="9" height="3.5" rx="0.5" fill="#E2E8F0" />
        {/* Bulbous Onion Dome */}
        <path
          d="M 41 31 
             C 38.5 28.5, 38 24.5, 40.5 20.5 
             C 42 18.5, 44.5 17.5, 45 15.5 
             C 45.5 17.5, 48 18.5, 49.5 20.5 
             C 52 24.5, 51.5 28.5, 49 31 
             Z"
          fill="url(#marbleDomeGrad)"
          stroke="#CBD5E1"
          strokeWidth="0.5"
        />
        {/* Fluting Ridges */}
        <path d="M 45 15.5 Q 43.5 23 43 31" stroke="#94A3B8" strokeWidth="0.4" fill="none" opacity="0.6" />
        <path d="M 45 15.5 Q 46.5 23 47 31" stroke="#94A3B8" strokeWidth="0.4" fill="none" opacity="0.6" />
        {/* Golden Finial (Kalasa) */}
        <line x1="45" y1="15.5" x2="45" y2="12" stroke="url(#goldFinialGrad)" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="45" cy="11.5" r="0.75" fill="#FDE047" />
      </g>

      {/* ================= CENTRAL GRAND BULBOUS DOME ================= */}
      <g id="center-grand-dome">
        {/* Marble Octagonal Drum */}
        <rect x="25" y="26" width="14" height="4.5" rx="0.5" fill="#E2E8F0" />
        <line x1="25.5" y1="28.5" x2="38.5" y2="28.5" stroke="#CBD5E1" strokeWidth="0.5" />

        {/* Majestic Bulbous Marble Dome Profile */}
        <path
          d="M 25.5 26 
             C 21 22.5, 20.5 16, 24.8 10.5 
             C 27.5 7, 30.8 5.5, 32 3 
             C 33.2 5.5, 36.5 7, 39.2 10.5 
             C 43.5 16, 43 22.5, 38.5 26 
             Z"
          fill="url(#marbleDomeGrad)"
          stroke="#E2E8F0"
          strokeWidth="0.6"
        />

        {/* Fluting Ribs */}
        <path d="M 32 3 Q 28.5 14 27.5 26" stroke="#94A3B8" strokeWidth="0.5" fill="none" opacity="0.5" />
        <path d="M 32 3 Q 35.5 14 36.5 26" stroke="#94A3B8" strokeWidth="0.5" fill="none" opacity="0.5" />
        <path d="M 32 3 L 32 26" stroke="#CBD5E1" strokeWidth="0.4" fill="none" opacity="0.55" />

        {/* Golden Kalasa & Pakistani Crescent Finial */}
        <line x1="32" y1="3" x2="32" y2="0.2" stroke="url(#goldFinialGrad)" strokeWidth="1" strokeLinecap="round" />
        <circle cx="32" cy="0" r="1.1" fill="#FDE047" />
        {/* Crescent at apex */}
        <path
          d="M 32.7 -1.6 C 32 -1.6 31.2 -1 31.2 -0.2 C 31.2 0.6 31.9 1.3 32.8 1.3 C 32.2 1.3 31.7 0.9 31.7 -0.2 C 31.7 -1 32.2 -1.5 32.7 -1.6 Z"
          fill="#FEF08A"
        />
      </g>

      {/* ================= MONUMENTAL CENTRAL PISHTAQ GATEWAY ================= */}
      <path
        d="M 22.5 28 L 41.5 28 L 41.5 55 L 22.5 55 Z"
        fill="#EA580C"
      />
      {/* Decorative Kangura Cresting / Merlons along Top of Gateway */}
      <path
        d="M 22.5 28 L 23.5 26 L 24.5 28 L 25.5 26 L 26.5 28 L 27.5 26 L 28.5 28 L 29.5 26 L 30.5 28 L 31.5 26 L 32.5 28 L 33.5 26 L 34.5 28 L 35.5 26 L 36.5 28 L 37.5 26 L 38.5 28 L 39.5 26 L 40.5 28 L 41.5 26"
        stroke="#FEF08A"
        strokeWidth="0.7"
        fill="none"
      />

      {/* Left Wing Recessed Arch */}
      <g id="left-wing-arch">
        <path
          d="M 14 54 L 14 43 C 14 40, 16 38.5, 17.5 37 C 19 38.5, 21 40, 21 43 L 21 54 Z"
          fill="url(#iwanShadow)"
        />
        <path
          d="M 14.8 54 L 14.8 44 C 15 42, 16.5 41, 17.5 39 C 18.5 41, 20 42, 20.2 44 L 20.2 54"
          stroke="#FDBA74"
          strokeWidth="0.6"
          fill="none"
        />
      </g>

      {/* Right Wing Recessed Arch */}
      <g id="right-wing-arch">
        <path
          d="M 43 54 L 43 43 C 43 40, 45 38.5, 46.5 37 C 48 38.5, 50 40, 50 43 L 50 54 Z"
          fill="url(#iwanShadow)"
        />
        <path
          d="M 43.8 54 L 43.8 44 C 44 42, 45.5 41, 46.5 39 C 47.5 41, 49 42, 49.2 44 L 49.2 54"
          stroke="#FDBA74"
          strokeWidth="0.6"
          fill="none"
        />
      </g>

      {/* Grand Central Iwan Portal Arch with Marble Calligraphic Band */}
      <g id="central-iwan-portal">
        {/* Sandstone frame border with white marble inlay line */}
        <rect x="24.5" y="30" width="15" height="25" rx="0.5" fill="#9A3412" stroke="#FEF08A" strokeWidth="0.5" />

        {/* Deep Vaulted Iwan Shadow */}
        <path
          d="M 26 55 L 26 39 
             C 26 36, 27.5 34.5, 29.5 33.5 
             C 30.2 33, 31.2 31.8, 32 30.5 
             C 32.8 31.8, 33.8 33, 34.5 33.5 
             C 36.5 34.5, 38 36, 38 39 
             L 38 55 Z"
          fill="url(#iwanShadow)"
        />

        {/* Distinctive Mughal Multi-foil Cusped Arch Trim */}
        <path
          d="M 26.5 55 L 26.5 40 
             C 27 38.5, 28 37.5, 29.3 37
             C 29.6 36.2, 30.6 35.5, 32 34
             C 33.4 35.5, 34.4 36.2, 34.7 37
             C 36 37.5, 37 38.5, 37.5 40
             L 37.5 55"
          stroke="url(#goldFinialGrad)"
          strokeWidth="0.75"
          fill="none"
        />

        {/* Inner Santuary Doorway Entrance */}
        <path
          d="M 29.5 55 L 29.5 47 C 29.5 45.2, 30.5 44, 32 43 C 33.5 44, 34.5 45.2, 34.5 47 L 34.5 55 Z"
          fill="#020617"
        />
      </g>

      {/* Decorative Pishtaq Guldastas (Slender Corner Turrets) */}
      <rect x="22.2" y="26" width="1.2" height="4" fill="url(#goldFinialGrad)" rx="0.3" />
      <rect x="40.6" y="26" width="1.2" height="4" fill="url(#goldFinialGrad)" rx="0.3" />
      <polygon points="22.8,26 21.8,24 23.8,24" fill="#FDE047" />
      <polygon points="41.2,26 40.2,24 42.2,24" fill="#FDE047" />
    </svg>
  );
};

/**
 * Pakistani Architectural Heritage Emblem Badge
 * Houses Badshahi Mosque inside an authentic Pakistan-green jewel badge
 * with gold accents, subtle crescent, and emerald glow.
 */
export const PakistaniHeritageBadge: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-11 h-11",
    lg: "w-14 h-14"
  }[size];

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  }[size];

  return (
    <div
      className={`relative ${sizeClasses} rounded-2xl bg-gradient-to-br from-[#01411C] via-[#025626] to-[#012d14] flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-500/30 ring-1 ring-emerald-400/20 shrink-0 overflow-hidden group transition-all duration-300 hover:border-emerald-400/60 hover:shadow-emerald-900/80 ${className}`}
      title="Badshahi Mosque, Lahore — Pakistan Architectural Heritage"
    >
      {/* Subtle ambient emerald glow & crescent watermark in background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent pointer-events-none" />
      
      {/* Subtle Pakistani Crescent Accent behind the mosque */}
      <svg
        className="absolute -top-1 -right-1 w-7 h-7 text-emerald-300/15 pointer-events-none select-none"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.88 0 5.48-1.22 7.31-3.17-3.98.37-7.66-2.58-8.2-6.57-.61-4.51 2.53-8.54 7.03-9.01C16.35 2.45 14.26 2 12 2z" />
      </svg>

      {/* Badshahi Mosque Monument Logo */}
      <BadshahiMosqueLogo className={`${iconSizes} relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105`} />
    </div>
  );
};
