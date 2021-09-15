/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  mode: 'jit',
  purge: ['./packages/renderer/index.html', './packages/**/*.{js,ts,jsx,tsx}'],
  variants: {},
  plugins: []
}
