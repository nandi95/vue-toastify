import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import pkg from './package.json' with { type: 'json' };
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { compileString, compileStringAsync } from 'sass';

const banner = `
/*! ================================
${pkg.name} v${pkg.version}
(c) 2019-present ${pkg.author}
Released under ${pkg.license} License
================================== */
`;

export default defineConfig(({ mode }) => {
    const config: Parameters<typeof defineConfig>[0] = {
        plugins: [
            vue(),
            viteStaticCopy({
                targets: [
                    {
                        src: ['src/assets/themes/*.scss', '!src/assets/themes/common.scss'],
                        dest: 'themes',
                        rename: (fileName) => {
                            return `${fileName}.css`;
                        },
                        transform: (content) => {
                            return compileString(
                                content,
                                {
                                    syntax: 'scss',
                                    style: 'compressed',
                                    // required to be able to resolve common.scss
                                    loadPaths: ['src/assets/themes']
                                }
                            ).css;
                        }
                    }
                ]
            })
        ],
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

                    return `${entryName}.${format}.js`;
                }
            },
            rollupOptions: {
                external: ['vue'],
                output: {
                    globals: {
                        vue: 'Vue'
                    },
                    assetFileNames: assetInfo => {
                        return assetInfo.names.includes('vue-toastify.css') ? 'index.css' : assetInfo.names[0];
                    },
                    exports: 'named',
                    banner
                }
            }
        };
    }

    return config;
});
