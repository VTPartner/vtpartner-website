/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      fontFamily: {
        titillium: ["Titillium Web", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1 rem",
          sm: "2 rem",
          lg: "4 rem",
          xl: "5 rem",
          "2xl": "6 rem",
        },
      },
      gridTemplateColumns: {
        custom: "1fr 0.1fr 1fr",
      },
      colors: {
        // primary: "#F0F3FF",
        // secondary: "#808080",
        // tertiary: "#FFFFFF",
        // "black-100": "#100d25",
        // "black-200": "#090325",
        // "white-100": "#f3f3f3","";
        // white: "#000",
        primary: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
        "black-100": "#100d25",
        "black-200": "#090325",
        "white-100": "#f3f3f3",
      },
      boxShadow: {
        card: "0px 35px 120px -15px #211e35",
      },
      screens: {
        xs: "450px",
      },

      backgroundImage: {
        "hero-pattern": "url('public/logo_new.png')",
      },
    },
  },

  plugins: [],
};

("");
