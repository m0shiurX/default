/** @type {import('tailwindcss').Config} */
export default {
	content: ['./*.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		fontFamily: {
			bn: ['Hind Siliguri', 'sans-serif'],
		},
		extend: {
			listStyleImage: {
				tick: 'url("./tick.svg")',
			},
		},
		container: {
			center: true,
			padding: '2rem',
		},
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: ['light', 'dark', 'cupcake', 'emerald'],
	},
};
