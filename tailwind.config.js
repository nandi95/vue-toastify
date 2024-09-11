/**
 * @type {import("@types/tailwindcss").TailwindConfig}
 */
module.exports = {
    darkMode: "class",
    content: ["./src/**/*.{ts,tsx,vue}"],
    plugins: [
        require("daisyui")
    ],
    daisyui: {
        themes: ['emerald', 'halloween'],
        logs: false
    }
};
