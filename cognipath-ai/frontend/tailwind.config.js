/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C1730",
        inkLight: "#231E3D",
        inkLighter: "#2A2450",
        surface: "#2F2952",
        surfaceHover: "#352F5C",
        parchment: "#F3EFEA",
        contour: "#3D3560",
        contourLight: "#4A4370",
        trail: "#F2643B",
        trailGlow: "rgba(242, 100, 59, 0.15)",
        moss: "#4ADE80",
        mossGlow: "rgba(74, 222, 128, 0.12)",
        amber: "#FBBF24",
        amberGlow: "rgba(251, 191, 36, 0.12)",
        rust: "#EF4444",
        rustGlow: "rgba(239, 68, 68, 0.12)",
        mist: "#A79FC7",
        sky: "#60A5FA",
        skyGlow: "rgba(96, 165, 250, 0.12)",
        violet: "#A78BFA",
        violetGlow: "rgba(167, 139, 250, 0.12)",
      },
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        glow: "0 0 20px rgba(242, 100, 59, 0.15)",
        'glow-green': "0 0 20px rgba(74, 222, 128, 0.15)",
        card: "0 4px 24px rgba(0, 0, 0, 0.2)",
        'card-hover': "0 8px 32px rgba(0, 0, 0, 0.3)",
        'inner-glow': "inset 0 1px 0 rgba(255,255,255,0.05)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'green-banner': 'linear-gradient(135deg, #065F46 0%, #047857 50%, #059669 100%)',
        'purple-card': 'linear-gradient(135deg, #2A2450 0%, #352F5C 100%)',
        'trail-gradient': 'linear-gradient(135deg, #F2643B 0%, #E11D48 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 5px rgba(242, 100, 59, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(242, 100, 59, 0.25)' },
        },
      },
    },
  },
  plugins: [],
};