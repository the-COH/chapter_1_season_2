module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mont: '"Montserrat"',
        "mont-italic": '"Montserrat-Italic"',
        bold: "IBMPlexSans-Bold",
        elight: "IBMPlexSans-ExtraLight",
        light: "IBMPlexSans-Light",
        medium: "IBMPlexSans-Medium",
        regular: "IBMPlexSans-Regular",
        sbold: "IBMPlexSans-SemiBold",
        thin: "IBMPlexSans-Thin",
        dos: "StardosStencil-Regular",
        dosBold: "StardosStencil-Bold",
      },
      fontSize: {
        xxs: "0.625rem",
      },
      colors: {
        // green: "#00df81",
        green: "#6AFC5F",
        red: "#e82027",
      },
      keyframes: {
        wave: {
          "0%": { transform: "translateY(0)" },
          "80%": { opacity: 80 },
          "100%": { transform: "translateY(-50%)", opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
