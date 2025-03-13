/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // In your theme configuration
  theme: {
    extend: {
      colors: {
        // Your existing colors...
      },
      variables: {
        "--chart-1": "215 100% 50%", // Blue hue
        "--chart-2": "43 100% 50%", // Yellow hue
        "--chart-3": "130 100% 50%", // Green hue
        "--chart-4": "338 100% 50%", // Pink hue
        "--chart-5": "270 100% 50%", // Purple hue
      },
    },
  },
  plugins: [],
};
