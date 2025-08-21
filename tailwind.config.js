/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins"],
        regular: ["Poppins-Regular"],
        poppinsbold: ["Poppins-Bold"],
        poppinsblack: ["Poppins-Black"],
        cunia: ["Cunia"],
        cuniaRegular: ["Cunia-Regular"],
        gilroy: ["Gilroy"],
        yung: ["Young"],
        poppins: ["Poppins", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
      },
      colors: {
        // ✅ Primary-Secondary Scheme
        primary: {
          DEFAULT: "#fd3a55",      // main
          light: "emerald-400",        // lighter version
          dark: "#c2002f",         // darker version
        },
        secondary: {
          DEFAULT: "#FFC13D",      // main yellow
          light: "#ffdc82",
          dark: "#cc9a00",
        },

        // ✅ Other Colors (existing)
        coolGray: "#8493A8",
        midGray: "#ADB9CA",
        lightGray: "#CAD3DF",
        deepBlue: "#0E0E52",
        indigo: "#4169e1",
        darkBlue: "#1167b1",
        eb5757: "#EB5757",
        dee8ff: "#DEE8FF",
        efeefb: "#EFEEFB",
        d7d4f5: "#D7D4F5",
        b9b6ec: "#B9B6EC",
        white: "#ffffff",
        f5f8ff: "#F5F8FF",
        green: "#23A455",
        lightPink: "#D02F68",
        darkGray: "#4E4E4E",
        bgBlue: "#FFE642",
        bgBlueOld: "#F2CF7E",
        dfefff: "#DFEFFF",
        e61a89: "#E61A89",
        gold: "#B4833E",
        lightGold: "#EDD87D",
        platinum: "#C7C6C4",
        lightPlatinum: "#F4F3F1",
        blue: "#4054b2",
        black: "#000000",
        brown: "#654321",
        arrowC: "#0B0B38",
        dotC: "#9EB8D9",
        buttonC: "#B32A64",
        redC: "#eb4034",
        singC: "#0e0e52",
        walletColor: "#21169B",
        yellowColor: "#FFFFF0",
        // purple1: "#471594",
        // purple: "#FF7900",
        red: "#FF0000",
        bgWhite: "#FDF8EE",
        heroBg: "#4D2C5E03",
        tagsky: "#1BCBE3",
        light:"#ff6f7d"
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
