export interface ThemeStyles {
  background: string;
  backgroundImage?: string;
  color: string;
  fontFamily: string;
}

export interface ButtonStyles {
  background: string;
  color: string;
  border: string;
  borderRadius: string;
  backdropFilter?: string;
  boxShadow?: string;
}

export interface Theme {
  id: string;
  name: string;
  preview: string; // small CSS background for the picker swatch
  accent: string;
  page: ThemeStyles;
  button: ButtonStyles;
}

export const themes: Record<string, Theme> = {
  default: {
    id: "default",
    name: "Clean",
    preview: "linear-gradient(180deg, #f8fafc, #e2e8f0)",
    accent: "#6366f1",
    page: {
      background: "#ffffff",
      color: "#111827",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    button: {
      background: "#ffffff",
      color: "#111827",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
    },
  },
  dark: {
    id: "dark",
    name: "Dark",
    preview: "linear-gradient(180deg, #111827, #030712)",
    accent: "#a78bfa",
    page: {
      background: "#030712",
      color: "#f9fafb",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    button: {
      background: "#1f2937",
      color: "#f9fafb",
      border: "1px solid #374151",
      borderRadius: "9999px",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    preview: "linear-gradient(180deg, #f5f5f4, #e7e5e4)",
    accent: "#78716c",
    page: {
      background: "#fafaf9",
      color: "#292524",
      fontFamily: "Georgia, 'Times New Roman', serif",
    },
    button: {
      background: "transparent",
      color: "#292524",
      border: "1px solid #d6d3d1",
      borderRadius: "6px",
    },
  },
  gradient: {
    id: "gradient",
    name: "Gradient",
    preview: "linear-gradient(135deg, #818cf8, #c084fc, #f472b6)",
    accent: "#7c3aed",
    page: {
      background: "#f5f3ff",
      backgroundImage: "linear-gradient(135deg, #e0e7ff 0%, #f5f3ff 50%, #fce7f3 100%)",
      color: "#1f2937",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    button: {
      background: "rgba(255,255,255,0.8)",
      color: "#1f2937",
      border: "none",
      borderRadius: "12px",
      backdropFilter: "blur(8px)",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
    },
  },
  neon: {
    id: "neon",
    name: "Neon",
    preview: "linear-gradient(180deg, #052e16, #000000)",
    accent: "#22c55e",
    page: {
      background: "#000000",
      color: "#4ade80",
      fontFamily: "'Courier New', Courier, monospace",
    },
    button: {
      background: "transparent",
      color: "#4ade80",
      border: "1px solid #4ade80",
      borderRadius: "0px",
      boxShadow: "0 0 8px rgba(74,222,128,0.3), inset 0 0 8px rgba(74,222,128,0.05)",
    },
  },
  soft: {
    id: "soft",
    name: "Soft",
    preview: "linear-gradient(180deg, #fecdd3, #ccfbf1)",
    accent: "#f43f5e",
    page: {
      background: "#fff1f2",
      backgroundImage: "linear-gradient(180deg, #fff1f2 0%, #f0fdfa 100%)",
      color: "#374151",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    button: {
      background: "rgba(255,255,255,0.7)",
      color: "#374151",
      border: "none",
      borderRadius: "16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    preview: "linear-gradient(180deg, #0ea5e9, #0c4a6e)",
    accent: "#38bdf8",
    page: {
      background: "#0c4a6e",
      backgroundImage: "linear-gradient(180deg, #0c4a6e 0%, #164e63 100%)",
      color: "#f0f9ff",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    button: {
      background: "rgba(255,255,255,0.12)",
      color: "#e0f2fe",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "12px",
      backdropFilter: "blur(8px)",
    },
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    preview: "linear-gradient(135deg, #fbbf24, #f97316, #ef4444)",
    accent: "#f97316",
    page: {
      background: "#fef3c7",
      backgroundImage: "linear-gradient(135deg, #fef3c7 0%, #ffedd5 50%, #fee2e2 100%)",
      color: "#7c2d12",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    button: {
      background: "rgba(255,255,255,0.65)",
      color: "#9a3412",
      border: "none",
      borderRadius: "9999px",
      boxShadow: "0 2px 8px rgba(249,115,22,0.15)",
    },
  },
};

export const themeList = Object.values(themes);
