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
		themes: [
			{
				default: {
					primary: '#f76762',
					secondary: '#f7aa57',
					accent: '#00ae89',
					neutral: '#1c1c1c',
					'base-100': '#f0ffff',
					info: '#fef3c7',
					success: '#00b100',
					warning: '#f47100',
					error: '#ff4a74',
				},
			},
		],
	},
};
