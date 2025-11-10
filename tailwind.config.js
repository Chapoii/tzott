/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // 温和的蓝色系
        work: '#f97316',    // 橙色（工作状态）
        rest: '#22c55e',    // 绿色（休息状态）
        accent: '#a855f7',  // 紫色（特殊成就或状态）
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}