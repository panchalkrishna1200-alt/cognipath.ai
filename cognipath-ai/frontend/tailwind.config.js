/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Warm indigo/plum base with a coral path accent - deliberately not
        // green, not pure black/white, and not the generic cream+terracotta
        // or near-black+neon SaaS defaults.
        ink: "#1C1730",        // deep indigo-plum - primary background
        inkLight: "#272042",   // panel background
        parchment: "#F3EFEA",  // warm off-white text on dark bg
        contour: "#3D3560",    // hairline borders / dividers
        trail: "#F2643B",      // coral path marker - the one bold accent
        moss: "#5FB88D",       // mastered / green status (functional, not decorative)
        amber: "#F2B84B",      // developing / yellow status
        rust: "#E14F4F",       // gap / red status
        mist: "#A79FC7",       // muted lavender-grey secondary text
      },
      fontFamily: {
        display: ["'Spectral'", "serif"],
        body: ["'IBM Plex Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};