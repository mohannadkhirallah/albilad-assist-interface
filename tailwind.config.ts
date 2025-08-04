import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'system-ui', 'sans-serif'],
				'sans': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				/* Al Bilad Refined Banking Colors */
				'albilad-primary': 'hsl(var(--albilad-primary))',
				'albilad-primary-hover': 'hsl(var(--albilad-primary-hover))',
				'albilad-accent': 'hsl(var(--albilad-accent))',
				'albilad-accent-hover': 'hsl(var(--albilad-accent-hover))',
				'albilad-bg': 'hsl(var(--albilad-bg))',
				'albilad-card': 'hsl(var(--albilad-card))',
				'albilad-surface': 'hsl(var(--albilad-surface))',
				'albilad-border': 'hsl(var(--albilad-border))',
				'albilad-muted': 'hsl(var(--albilad-muted))',
				'albilad-dark': 'hsl(var(--albilad-dark))',
				'albilad-focus': 'hsl(var(--albilad-focus))',
				'albilad-hover-bg': 'hsl(var(--albilad-hover-bg))',
				'albilad-active': 'hsl(var(--albilad-active))',
				
				/* Legacy Support */
				'banking-card': 'hsl(var(--albilad-surface))',
				'banking-border': 'hsl(var(--albilad-border))',
				'banking-muted': 'hsl(var(--albilad-card))',
				'banking-error': 'hsl(var(--destructive))',
				'banking-warning': 'hsl(43 96% 56%)',
				
				/* Standard Colors */
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-glow': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.02)' }
				},
				'typing': {
					'0%': { opacity: '0.3' },
					'50%': { opacity: '1' },
					'100%': { opacity: '0.3' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'elastic-bounce': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' },
					'100%': { transform: 'scale(1)' }
				},
				'underline-expand': {
					'0%': { transform: 'scaleX(0)' },
					'100%': { transform: 'scaleX(1)' }
				},
				'float-up': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'typing': 'typing 1.4s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'elastic-bounce': 'elastic-bounce 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
				'underline-expand': 'underline-expand 0.3s ease-out',
				'float-up': 'float-up 0.4s ease-out'
			},
			boxShadow: {
				'neumorph-light': 'var(--shadow-neumorph-light)',
				'neumorph-inset': 'var(--shadow-neumorph-inset)',
				'elevated': 'var(--shadow-elevated)',
				'floating': 'var(--shadow-floating)',
				'banking': 'var(--shadow-banking)',
				'card': 'var(--shadow-card)'
			},
			backdropBlur: {
				'xs': '2px',
			},
			letterSpacing: {
				'wide': '0.025em',
				'wider': '0.05em',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
