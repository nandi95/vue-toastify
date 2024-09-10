import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import pkg from './package.json' with { type: 'json' };

const banner = `
/*! ================================
${pkg.name} v${pkg.version}
(c) 2019-present ${pkg.author}
Released under ${pkg.license} License
================================== */
`;

export default defineConfig(({ mode }) => {
    const config: Parameters<typeof defineConfig>[0] = {
        plugins: [vue()],
        define: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            __VUE_OPTIONS_API__: false
        }
    };

    if (mode === 'library') {
        config.build = {
            minify: true,
            copyPublicDir: false,
            lib: {
                entry: {
                    'index': 'src/index.ts',
                    'useToast': 'src/composables/useToast.ts',
                    'useVtEvents': 'src/composables/useVtEvents.ts',
                    'useVtSettings': 'src/composables/useSettings.ts'
                },
                name: pkg.name,
                fileName: (format, entryName) => {
                    if (format === 'es') {
                        return `${entryName}.mjs`;
                    }

                    if (format === 'cjs') {
                        return `${entryName}.cjs`;
                    }

                    return `${entryName}.${format}.js`
                }
            },
            rollupOptions: {
                external: ['vue'],
                output: {
                    globals: {
                        vue: 'Vue'
                    },
                    assetFileNames: assetInfo => assetInfo.name === 'style.css' ? 'index.css' :assetInfo.name!,
                    exports: 'named',
                    banner
                }
            }
        };
    }

    return config;
});
