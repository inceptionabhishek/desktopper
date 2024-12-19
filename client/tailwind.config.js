/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "lg-1400": "1400px",
        "md-850": "850px",
        "md-1084": "1084px",
      },
      spacing: {
        4.25: "1.0625rem", //17px
        5.5: "1.375rem", //22px
        6.5: "1.625rem", //22px
        7.5: "1.875rem", //22px
        10.5: "2.625rem", //22px
        12.25: "3.125rem", //50px
        12.75: "3.375rem", //54px
        14.5: "3.625rem", //58px
        15: "3.75rem", //60px
        15.25: "3.8125rem", //61px
        16.125: "4.0625rem", //65px
        16.5: "4.25rem", //68px
        16.75: "4.375rem", //70px
        "10p": "10%", //10%
        "15p": "15%", //10%
      },
      maxWidth: {
        "3.71xl": "600px", //859px
        "3.19xl": "43.25rem", //692px
        "1.72xl": "30.125rem", //642px
        "md-47": "414px", //414px
      },
      fontSize: {
        logo: ["40px", "22px"],
        "3.5xl": ["32px", "48px"],
        footer: ["10px", "22px"],
      },
      colors: {
        default: "#2F4C5F",
        blue_rgba: "rgb(0, 150, 235)",
        placeholder: "#4B4B4B",
        backicon: "#FEE5EE",
        activenavbar: "rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
