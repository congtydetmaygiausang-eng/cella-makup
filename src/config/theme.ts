/**
 * CELLA Design Tokens & Theme Configuration
 */

export const THEME = {
  colors: {
    primary: "#5850EC", // Sắc tím thương hiệu CELLA
    primaryHover: "#4338CA",
    primaryLight: "#EEF2FF",
    primaryGradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #4338CA 100%)",
    primaryGlow: "rgba(88, 80, 236, 0.35)",

    surface: "#F8F9FF", // Nền sáng hiện đại
    surfaceCard: "#FFFFFF",
    containerLight: "#EFF4FF",
    containerBorder: "rgba(226, 232, 240, 0.8)",

    darkAccent: "#0B0C16", // Nền Splash & Glass Spotlight
    darkAccentCard: "#1E1B4B",

    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",

    // Status colors
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
    auraPink: "#EC4899",
    auraPurple: "#8B5CF6",
    auraCyan: "#06B6D4",
  },
  glass: {
    standard: "backdrop-blur-md bg-white/80 border border-white/40 shadow-sm",
    heavy: "backdrop-blur-lg bg-white/90 border border-white/60 shadow-md",
    dark: "backdrop-blur-md bg-[#0B0C16]/80 border border-white/10 shadow-lg text-white",
    cardLight: "bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(88,80,236,0.06)]",
  },
  borderRadius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    card: "rounded-2xl", // 16px
    pill: "rounded-3xl", // 24px
    full: "rounded-full",
  },
};
