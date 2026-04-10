interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "icon" | "full";
  theme?: "light" | "dark";
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 32, text: "text-lg" },
  lg: { icon: 40, text: "text-2xl" },
  xl: { icon: 52, text: "text-3xl" },
};

export function Logo({ size = "md", variant = "full", theme = "light", className = "" }: LogoProps) {
  const s = sizes[size];
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="drop-main" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="40%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
          <linearGradient id="drop-shine" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#e879f9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="drop-ring" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Outer ring / glow */}
        <path
          d="M24 4C24 4 9 19 9 28C9 36.284 15.716 43 24 43C32.284 43 39 36.284 39 28C39 19 24 4 24 4Z"
          fill="url(#drop-ring)"
          opacity="0.5"
        />
        {/* Main drop */}
        <path
          d="M24 7C24 7 12 19 12 27C12 33.627 17.373 39 24 39C30.627 39 36 33.627 36 27C36 19 24 7 24 7Z"
          fill="url(#drop-main)"
        />
        {/* Inner shine */}
        <path
          d="M24 12C24 12 16 21 16 27C16 31.418 19.582 35 24 35C28.418 35 32 31.418 32 27C32 21 24 12 24 12Z"
          fill="url(#drop-shine)"
        />
        {/* Highlight spot */}
        <ellipse cx="19" cy="22" rx="3" ry="4" fill="white" opacity="0.15" transform="rotate(-20 19 22)" />
      </svg>
      {variant === "full" && (
        <span className={`font-bold tracking-tight ${s.text} ${textColor}`}>
          Page<span className="text-gradient-brand">Drop</span>
        </span>
      )}
    </span>
  );
}
