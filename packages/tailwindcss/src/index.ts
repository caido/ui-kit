import plugin from "tailwindcss/plugin";

export default plugin(() => {}, {
    theme: {
        extend: {
            colors: {
                primary: {
                    100: 'hsl(var(--c-primary-100))',
                    200: 'hsl(var(--c-primary-200))',
                    300: 'hsl(var(--c-primary-300))',
                    400: 'hsl(var(--c-primary-400))',
                    500: 'hsl(var(--c-primary-500))',
                    600: 'hsl(var(--c-primary-600))',
                    700: 'hsl(var(--c-primary-700))',
                    800: 'hsl(var(--c-primary-800))',
                    900: 'hsl(var(--c-primary-900))',
                },
                secondary: {
                    100: 'hsl(var(--c-secondary-100))',
                    200: 'hsl(var(--c-secondary-200))',
                    300: 'hsl(var(--c-secondary-300))',
                    400: 'hsl(var(--c-secondary-400))',
                    500: 'hsl(var(--c-secondary-500))',
                    600: 'hsl(var(--c-secondary-600))',
                    700: 'hsl(var(--c-secondary-700))',
                    800: 'hsl(var(--c-secondary-800))',
                    900: 'hsl(var(--c-secondary-900))',
                },
                danger: {
                    100: 'hsl(var(--c-danger-100))',
                    200: 'hsl(var(--c-danger-200))',
                    300: 'hsl(var(--c-danger-300))',
                    400: 'hsl(var(--c-danger-400))',
                    500: 'hsl(var(--c-danger-500))',
                    600: 'hsl(var(--c-danger-600))',
                    700: 'hsl(var(--c-danger-700))',
                    800: 'hsl(var(--c-danger-800))',
                    900: 'hsl(var(--c-danger-900))',
                },
                info: {
                    100: 'hsl(var(--c-info-100))',
                    200: 'hsl(var(--c-info-200))',
                    300: 'hsl(var(--c-info-300))',
                    400: 'hsl(var(--c-info-400))',
                    500: 'hsl(var(--c-info-500))',
                    600: 'hsl(var(--c-info-600))',
                    700: 'hsl(var(--c-info-700))',
                    800: 'hsl(var(--c-info-800))',
                    900: 'hsl(var(--c-info-900))',
                },
                success: {
                    100: 'hsl(var(--c-success-100))',
                    200: 'hsl(var(--c-success-200))',
                    300: 'hsl(var(--c-success-300))',
                    400: 'hsl(var(--c-success-400))',
                    500: 'hsl(var(--c-success-500))',
                    600: 'hsl(var(--c-success-600))',
                    700: 'hsl(var(--c-success-700))',
                    800: 'hsl(var(--c-success-800))',
                    900: 'hsl(var(--c-success-900))',
                },
                surface: {
                    0: 'hsl(var(--c-surface-0))',
                    200: 'hsl(var(--c-surface-200))',
                    300: 'hsl(var(--c-surface-300))',
                    400: 'hsl(var(--c-surface-400))',
                    500: 'hsl(var(--c-surface-500))',
                    600: 'hsl(var(--c-surface-600))',
                    700: 'hsl(var(--c-surface-700))',
                    800: 'hsl(var(--c-surface-800))',
                    900: 'hsl(var(--c-surface-900))',
                }
            }
        },
    }
});