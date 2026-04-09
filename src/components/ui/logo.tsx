interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "full";
  theme?: "light" | "dark";
  className?: string;
}

const sizes = {
  sm: { icon: 24, text: "text-base" },
  md: { icon: 30, text: "text-lg" },
  lg: { icon: 38, text: "text-2xl" },
};

export function Logo({ size = "md", variant = "full", theme = "light", className = "" }: LogoProps) {
  const s = sizes[size];
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="logo-shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Drop shape */}
        <path
          d="M20 2C20 2 8 16 8 24C8 30.627 13.373 36 20 36C26.627 36 32 30.627 32 24C32 16 20 2 20 2Z"
          fill="url(#logo-grad)"
        />
        {/* Inner shine / page curl */}
        <path
          d="M20 8C20 8 13 18 13 24C13 27.866 16.134 31 20 31C23.866 31 27 27.866 27 24C27 18 20 8 20 8Z"
          fill="url(#logo-shine)"
        />
        {/* Page fold accent */}
        <path
          d="M22 16L18 22H22L20 28"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
      </svg>
      {variant === "full" && (
        <span className={`font-bold tracking-tight ${s.text} ${textColor}`}>
          Page<span className="text-gradient-brand">Drop</span>
        </span>
      )}
    </span>
  );
}
