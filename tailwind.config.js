/**
 * @type {import('@types/tailwindcss').TailwindConfig}
 */
module.exports = {
  content: ['**/*.html', './src/**/*.{ts,tsx,vue}'],
    plugins: [
        require('@tailwindcss/forms'),
    ]
}
